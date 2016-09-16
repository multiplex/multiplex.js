import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';
import forOf from '../utils/for-of';
import extend from '../utils/extend';

/**
* Initializes a new instance of the Set class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Set.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
export default function Set(iterable, comparer) {
    var table = new HashTable(comparer);

    if (iterable) {
        forOf(iterable, function (element) {
            table.add(element, element);
        });
    }

    this.table = table;
    this.size = this.table.count();
}

extend(Set, Collection, {
    /**
    * Appends a new element with the given value to the Set object. Returns the Set object.
    * @param {Object} value array The value of the element to add to the Set object.
    */
    add: function (value) {
        this.table.add(value, value);
        this.size = this.table.count();
        return this;
    },

    /**
    * Removes all elements from the Set object.
    */
    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    /**
    * Copies the values of the Set to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo: function (array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    },

    /**
    * Returns the number of values in the Set object.
    */
    count: function () {
        return this.size;
    },

    /**
    * Removes the element associated to the value and returns the value that Set.prototype.has(value) would have previously returned.
    * @param {Object} value The element to delete from the Set.
    * @returns {Object}
    */
    delete: function (value) {
        var result = this.table.remove(value);
        this.size = this.table.count();
        return result ? value : false;
    },

    /**
    * Returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order.
    * @returns {Iterator}
    */
    entries: function () {
        return new SetIterator(this, -1);
    },

    /**
    * Calls callback once for each value present in the Set object, in insertion order.
    * @param {Function} callback The callback function.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Set object or not.
    * @param {Object} value The value to test for presence in the Set object.
    * @returns {Boolean}
    */
    has: function (value) {
        return this.table.contains(value);
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    keys: function () {
        return new SetIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    values: function () {
        return new SetIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Returns an array that contains an array of [key, value] for each element in the Set object in insertion order.
    * @returns {Array}
    */
    valueOf: function () {
        return this.table.entries();
    },

    toString: function () {
        return '[Set]';
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    '@@iterator': function () {
        return this.keys();
    }
});



function SetIterator(set, selector) {
    HashTableIterator.call(this, set, selector);
}

extend(SetIterator, HashTableIterator, {
    toString: function () {
        return '[Set Iterator]';
    }
});
