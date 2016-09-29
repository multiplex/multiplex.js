import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import EqulityComparer from './equality-comparer';
import count from '../utils/count';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterable from '../iteration/iterable-factory';

/**
* Initializes a new instance of the HashSet class.
* @param {Iterable=} iterable The Iterable whose elements are copied to the new set.
* @param {EqualityComparer=} comparer the EqualityComparer implementation to use when comparing values in the set.
*/
export default class HashSet extends Collection {
    constructor(iterable = null, comparer = EqulityComparer.instance) {
        super();
        this.table = new HashTable(EqulityComparer.from(comparer));

        if (iterable) {
            for (let element of $iterable(iterable)) {
                this.table.add(element);
            }
        }
    }

    /**
    * Adds an element to the current set.
    * @param {Object} item The element to add to the set.
    * @returns {Boolean}
    */
    add(item) {
        return this.table.add(item);
    }

    /**
    * Removes all elements from a HashSet object.
    */
    clear() {
        this.table.clear();
    }

    /**
    * Gets the number of elements contained in the HashSet.
    * @returns {Number}
    */
    count() {
        return this.table.count();
    }

    /**
    * Determines whether a HashSet object contains the specified element.
    * @param {Object} item The element to locate in the HashSet object.
    * @returns {Boolean}
    */
    contains(item) {
        return this.table.contains(item);
    }

    /**
    * Gets the EqualityComparer object that is used to determine equality for the values in the set.
    * @returns {EqualityComparer}
    */
    get comparer() {
        return this.table.comparer;
    }

    /**
    * Removes all elements in the specified collection from the current set.
    * @param {Iterable} other The collection of items to remove from the set.
    */
    exceptWith(other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return;
        }

        else if (other === this) {
            this.clear();
            return;
        }

        for (let element of other) {
            this.table.remove(element);
        }
    }

    /**
    * Modifies the current set so that it contains only elements that are also in a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    intersectWith(other) {
        assertNotNull(other);

        // intersection of anything with empty set is empty set, so return if count is 0
        if (this.count() === 0) {
            return;
        }

        let c = count(other, true);

        if (c !== -1) {
            if (c === 0) {
                this.clear();
                return;
            }

            // If other is a HashSet, it has unique elements according to its equality comparer,
            // but if they're using different equality comparers, then assumption of uniqueness
            // will fail. So first check if other is a hashset using the same equality comparer;
            // intersect is a lot faster if we can assume uniqueness.

            if (areEqualityComparersEqual(this, other)) {
                let arr = this.table.keys(),
                    item;

                c = this.count();

                while (c-- > 0) {
                    item = arr[c];
                    if (!other.contains(item)) {
                        this.table.remove(item);
                    }
                }

                return;
            }
        }

        this.intersectWith(new HashSet(other, this.compare));
    }

    /**
    * Determines whether the current set is a proper (strict) subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSubsetOf(other) {
        assertNotNull(other);

        let c = count(other, true);

        if (c !== -1) {
            if (this.count() === 0) {
                return c > 0;
            }

            // faster if other is a hashset (and we're using same equality comparer)
            else if (areEqualityComparersEqual(this, other)) {
                if (this.count() >= c) {
                    return false;
                }

                // this has strictly less than number of items in other, so the following
                // check suffices for proper subset.
                else {
                    return containsAllElements(other, this);
                }
            }
        }

        let result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount > 0);
    }

    /**
    * Determines whether the current set is a proper (strict) superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSupersetOf(other) {
        assertNotNull(other);

        // the empty set isn't a proper superset of any set.
        if (this.count() === 0) {
            return false;
        }

        let c = count(other, true);

        if (c !== -1) {
            // if other is the empty set then this is a superset
            if (c === 0) {
                return true;
            }

            // faster if other is a hashset with the same equality comparer
            else if (areEqualityComparersEqual(this, other)) {
                if (c >= this.count()) {
                    return false;
                }

                else {
                    return containsAllElements(this, other);
                }
            }
        }

        let result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount < this.count() && result.unfoundCount === 0);
    }

    /**
    * Determines whether a set is a subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSubsetOf(other) {
        assertNotNull(other);

        // The empty set is a subset of any set
        if (this.count() === 0) {
            return true;
        }

        else if (areEqualityComparersEqual(this, other)) {
            if (this.count() > other.count()) {
                return false;
            }

            else {
                return containsAllElements(other, this);
            }
        }

        let result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount >= 0);
    }

    /**
    * Determines whether the current set is a superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSupersetOf(other) {
        assertNotNull(other);

        let c = count(other, true);

        if (c !== -1) {
            // if other is the empty set then this is a superset
            if (c === 0) {
                return true;
            }

            else if (areEqualityComparersEqual(this, other)) {
                if (c > this.count()) {
                    return false;
                }
            }
        }

        return containsAllElements(this, other);
    }

    /**
    * Determines whether the current set overlaps with the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    overlaps(other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return false;
        }

        for (let element of other) {
            if (this.table.contains(element)) {
                return true;
            }
        }
        return false;
    }

    /**
    * Removes the specified element from a HashSet object.
    * @param {Object} item The element to remove.
    * @returns {Boolean}
    */
    remove(item) {
        return this.table.remove(item);
    }

    /**
    * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
    * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
    * @returns {Number}
    */
    removeWhere(match) {
        assertType(match, Function);

        let len = this.count(),
            arr = this.table.keys(),
            removed = 0,
            item;


        while (len-- > 0) {
            item = arr[len];

            if (match(item) && this.table.remove(item)) {
                removed++;
            }
        }

        return removed;
    }

    /**
    * Determines whether the current set and the specified collection contain the same elements.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    setEquals(other) {
        assertNotNull(other);

        if (areEqualityComparersEqual(this, other)) {
            if (this.count() !== other.count()) {
                return false;
            }

            /// already confirmed that the sets have the same number of distinct elements,
            /// so if one is a superset of the other then they must be equal

            return containsAllElements(this, other);
        }

        let c = count(other, true);

        if (c !== -1) {
            // if this count is 0 but other contains at least one element, they can't be equal
            if (this.count() === 0 && c > 0) {
                return false;
            }
        }

        let result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount === this.count() && result.unfoundCount === 0);
    }

    /**
    * Modifies the current set so that it contains only elements that are present
    * either in the current set or in the specified collection, but not both.
    * @param {Iterable} other The collection to compare to the current set.
    */
    symmetricExceptWith(other) {
        assertNotNull(other);

        if (this.count() === 0) {
            this.unionWith(other);
            return;
        }

        else if (other === this) {
            this.clear();
            return;
        }

        // If other is a HashSet, it has unique elements according to its equality comparer,
        // but if they're using different equality comparers, then assumption of uniqueness
        // will fail. So first check if other is a hashset using the same equality comparer;
        // symmetric except is a lot faster if we can assume uniqueness

        if (areEqualityComparersEqual(this, other)) {
            for (let element of other) {
                if (!this.table.remove(element)) {
                    this.table.add(element, null);
                }
            }
        }
        else {
            this.symmetricExceptWith(new HashSet(other, this.comparer));
        }
    }

    /**
    * Modifies the current set so that it contains all elements that are present
    * in either the current set or the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    unionWith(other) {
        assertNotNull(other);

        for (let element of other) {
            this.table.add(element);
        }
    }

    get [Symbol.toStringTag]() {
        return 'HashSet';
    }

    /**
    * Creates an array from the HashSet.
    * @returns {Array}
    */
    toArray() {
        return this.table.keys();
    }

    toString() {
        return '[HashSet]';
    }

    [Symbol.iterator]() {
        return new HashSetIterator(this);
    }
}


class HashSetIterator extends HashTableIterator {
    constructor(set) {
        super(set.table, key => key);
    }

    get [Symbol.toStringTag]() {
        return 'HashSet Iterator';
    }

    toString() {
        return '[HashSet Iterator]';
    }
}


class ElementCount {
    constructor(uniqueCount, unfoundCount) {
        this.uniqueCount = uniqueCount;
        this.unfoundCount = unfoundCount;
    }
}


function areEqualityComparersEqual(set1, set2) {
    return set1 instanceof HashSet && set2 instanceof HashSet && set1.comparer === set2.comparer;
}


function containsAllElements(set, other) {
    for (let element of other) {
        if (!set.contains(element)) {
            return false;
        }
    }

    return true;
}


function checkUniqueAndUnfoundElements(set, other, returnIfUnfound) {
    // need special case in case this has no elements.
    if (set.count() === 0) {
        /*jshint unused:false*/
        for (let element of other) {
            // all we want to know is whether other has 0 or 1 elements
            return new ElementCount(0, 1);
        }
    }

    let unfoundCount = 0,                      // count of items in other not found in this
        uniqueFoundCount = 0,                  // count of unique items in other found in this
        otable = new HashTable(set.comparer);

    for (let element of other) {
        if (set.contains(element)) {
            if (otable.add(element)) {
                uniqueFoundCount++;
            }
        }
        else {
            unfoundCount++;
            if (returnIfUnfound) {
                break;
            }
        }
    }

    return new ElementCount(uniqueFoundCount, unfoundCount);
}
