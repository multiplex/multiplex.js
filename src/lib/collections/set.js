import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';
import $iterable from '../iteration/iterable-factory';

/**
* Initializes a new instance of the Set class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Set.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
export default class Set extends Collection {
    constructor(iterable = null, comparer = null) {
        super();
        this.table = new HashTable(comparer);

        if (iterable) {
            for (let element of $iterable(iterable)) {
                this.table.add(element, element);
            }
        }
    }

    /**
    * Appends a new element with the given value to the Set object. Returns the Set object.
    * @param {Object} value array The value of the element to add to the Set object.
    */
    add(value) {
        this.table.add(value, value);
        return this;
    }

    /**
    * Removes all elements from the Set object.
    */
    clear() {
        this.table.clear();
    }

    /**
    * Copies the values of the Set to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    }

    /**
    * Returns the number of values in the Set object.
    * @returns {Number}
    */
    count() {
        return this.size;
    }

    /**
    * Removes the element associated to the value and returns the value that Set.prototype.has(value) would have previously returned.
    * @param {Object} value The element to delete from the Set.
    * @returns {Object}
    */
    delete(value) {
        let result = this.table.remove(value);
        return result ? value : false;
    }

    /**
    * Returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order.
    * @returns {Iterator}
    */
    entries() {
        return new SetIterator(this, -1);
    }

    /**
    * Calls callback once for each value present in the Set object, in insertion order.
    * @param {Function} callback The callback function.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach(callback, thisArg = null) {
        this.table.forEach(callback, this, thisArg);
    }

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Set object or not.
    * @param {Object} value The value to test for presence in the Set object.
    * @returns {Boolean}
    */
    has(value) {
        return this.table.contains(value);
    }

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    keys() {
        return new SetIterator(this, key => key);
    }

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    values() {
        return new SetIterator(this, (key, value) => value);
    }

    /**
    * Returns an array that contains an array of [key, value] for each element in the Set object in insertion order.
    * @returns {Array}
    */
    valueOf() {
        return this.table.entries();
    }

    /**
    * Returns the number of values in the Set object.
    * @returns {Number}
    */
    get size() {
        return this.table.count();
    }

    get [Symbol.toStringTag]() {
        return 'Set';
    }

    toString() {
        return '[Set]';
    }

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    [Symbol.iterator]() {
        return this.keys();
    }
}


class SetIterator extends HashTableIterator {
    constructor(set, selector = null) {
        super(set.table, selector);
    }

    get [Symbol.toStringTag]() {
        return 'Set Iterator';
    }

    toString() {
        return '[Set Iterator]';
    }
}
