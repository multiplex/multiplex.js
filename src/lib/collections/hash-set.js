import Collection from './collection';
import HashTable, { HashTableIterator } from './hash-table';
import EqulityComparer from './equality-comparer';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';
import extend from '../utils/extend';
import count from '../utils/count';
import defineProperty from '../utils/define-property';
import { collectionCount } from '../utils/count';
import $iterator from '../iteration/iterator-factory';

/**
* Initializes a new instance of the HashSet class.
* @param {Iterable=} iterable The Iterable whose elements are copied to the new set.
* @param {EqualityComparer=} comparer the EqualityComparer implementation to use when comparing values in the set.
*/
export default function HashSet(iterable, comparer) {
    var table = new HashTable(EqulityComparer.from(comparer));

    if (iterable) {
        forOf(iterable, function (element) {
            table.add(element);
        });
    }

    this.table = table;
    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(HashSet, Collection, {
    /**
    * Adds an element to the current set.
    * @param {Object} item The element to add to the set.
    * @returns {Boolean}
    */
    add: function (item) {
        return this.table.add(item);
    },

    /**
    * Removes all elements from a HashSet object.
    */
    clear: function () {
        this.table.clear();
    },

    /**
    * Gets the number of elements contained in the HashSet.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? count(this, predicate) : this.table.count();
    },

    /**
    * Determines whether a HashSet object contains the specified element.
    * @param {Object} item The element to locate in the HashSet object.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this.table.contains(item);
    },

    /**
    * Removes all elements in the specified collection from the current set.
    * @param {Iterable} other The collection of items to remove from the set.
    */
    exceptWith: function (other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return;
        }

        else if (other === this) {
            this.clear();
            return;
        }

        var table = this.table;
        forOf(other, function (element) {
            table.remove(element);
        });
    },

    /**
    * Modifies the current set so that it contains only elements that are also in a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    intersectWith: function (other) {
        assertNotNull(other);

        // intersection of anything with empty set is empty set, so return if count is 0
        if (this.count() === 0) {
            return;
        }

        var c = collectionCount(other);

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
                var arr = this.table.entries(true),
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
    },

    /**
    * Determines whether the current set is a proper (strict) subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSubsetOf: function (other) {
        assertNotNull(other);

        var c = collectionCount(other);

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

        var result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount > 0);
    },

    /**
    * Determines whether the current set is a proper (strict) superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSupersetOf: function (other) {
        assertNotNull(other);

        // the empty set isn't a proper superset of any set.
        if (this.count() === 0) {
            return false;
        }

        var c = collectionCount(other);

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

        var result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount < this.count() && result.unfoundCount === 0);
    },

    /**
    * Determines whether a set is a subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSubsetOf: function (other) {
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

        var result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount >= 0);
    },

    /**
    * Determines whether the current set is a superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSupersetOf: function (other) {
        assertNotNull(other);

        var c = collectionCount(other);

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
    },

    /**
    * Determines whether the current set overlaps with the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    overlaps: function (other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return false;
        }

        var table = this.table,
            res = false;

        forOf(other, function (element) {
            if (table.contains(element)) {
                res = true;
                return res;
            }
        });

        return res;
    },

    /**
    * Removes the specified element from a HashSet object.
    * @param {Object} item The element to remove.
    * @returns {Boolean}
    */
    remove: function (item) {
        return this.table.remove(item);
    },

    /**
    * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
    * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
    * @returns {Number}
    */
    removeWhere: function (match) {
        assertType(match, Function);

        var len = this.count(),
            arr = this.table.entries(true),
            removed = 0,
            item;


        while (len-- > 0) {
            item = arr[len];

            if (match(item) && this.table.remove(item)) {
                removed++;
            }
        }

        return removed;
    },

    /**
    * Determines whether the current set and the specified collection contain the same elements.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    setEquals: function (other) {
        assertNotNull(other);

        if (areEqualityComparersEqual(this, other)) {
            if (this.count() !== other.count()) {
                return false;
            }

            /// already confirmed that the sets have the same number of distinct elements,
            /// so if one is a superset of the other then they must be equal

            return containsAllElements(this, other);
        }

        var c = collectionCount(other);

        if (c !== -1) {
            // if this count is 0 but other contains at least one element, they can't be equal
            if (this.count() === 0 && c > 0) {
                return false;
            }
        }

        var result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount === this.count() && result.unfoundCount === 0);
    },

    /**
    * Modifies the current set so that it contains only elements that are present
    * either in the current set or in the specified collection, but not both.
    * @param {Iterable} other The collection to compare to the current set.
    */
    symmetricExceptWith: function (other) {
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
            var table = this.table;

            forOf(other, function (element) {
                if (!table.remove(element)) {
                    table.add(element, null);
                }
            });
        }
        else {
            this.symmetricExceptWith(new HashSet(other, this.comparer));
        }
    },

    /**
    * Modifies the current set so that it contains all elements that are present
    * in either the current set or the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    unionWith: function (other) {
        assertNotNull(other);

        var table = this.table;

        forOf(other, function (element) {
            table.add(element);
        });
    },

    /**
    * Creates an array from the HashSet.
    * @returns {Array}
    */
    toArray: function () {
        return this.table.entries(true);
    },

    toString: function () {
        return '[HashSet]';
    },

    '@@iterator': function () {
        return new HashSetIterator(this);
    }
});


function HashSetIterator(set) {
    HashTableIterator.call(this, set.table, function (key) {
        return key;
    });
}

extend(HashSetIterator, HashTableIterator, {
    toString: function () {
        return '[HashSet Iterator]';
    }
});


function ElementCount(uniqueCount, unfoundCount) {
    this.uniqueCount = uniqueCount;
    this.unfoundCount = unfoundCount;
}


function areEqualityComparersEqual(set1, set2) {
    return set1 instanceof HashSet && set2 instanceof HashSet && set1.comparer === set2.comparer;
}


function containsAllElements(set, other) {
    var res = true;

    forOf(other, function (element) {
        if (!set.contains(element)) {
            res = false;
            return res;
        }
    });

    return res;
}


function checkUniqueAndUnfoundElements(set, other, returnIfUnfound) {
    // need special case in case this has no elements.
    if (set.count() === 0) {
        if (!$iterator(other).next().done) {
            // all we want to know is whether other has 0 or 1 elements
            return new ElementCount(0, 1);
        }
    }

    var unfoundCount = 0,                      // count of items in other not found in this
        uniqueFoundCount = 0,                  // count of unique items in other found in this
        otable = new HashTable(set.comparer);

    forOf(other, function (element) {
        if (set.contains(element)) {
            if (otable.add(element)) {
                uniqueFoundCount++;
            }
        }
        else {
            unfoundCount++;
            if (returnIfUnfound) {
                return false;
            }
        }
    });

    return new ElementCount(uniqueFoundCount, unfoundCount);
}
