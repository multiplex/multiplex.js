import List from './list';
import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';
import {ARRAY_PROTOTYPE} from '../utils/builtin-types';
import assertType from '../utils/assert-type';

export default class ReadOnlyCollection extends Collection {
    constructor(list) {
        assertType(list, List);
        super();
        this.list = list;

        for (var i = 0, len = list.length; i < len; i++) {
            this[i] = list[i];
        }

        Object.freeze(this);
    }

    /**
    * Gets the number of elements contained in the ReadOnlyCollection.
    * @returns {Number}
    */
    count() {
        return this.length;
    }

    /**
    * Determines whether the ReadOnlyCollection contains a specific value.
    * @param {Object} item The object to locate in the ReadOnlyCollection.
    * @returns {Boolean}
    */
    contains(item) {
        this.list.contains(item);
    }

    /**
    * Copies the elements of the ReadOnlyCollection to an Array, starting at a particular Array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from ReadOnlyCollection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        this.list.copyTo(array, arrayIndex);
    }

    /**
    * Gets the element at the specified index.
    * @param {Number} index The zero-based index of the element to get.
    * @returns {Object}
    */
    get(index) {
        return this.list.get(index);
    }

    /**
    * Gets the number of elements contained in the ReadOnlyCollection.
    * @returns {Number}
    */
    get length() {
        return this.list.length;
    }

    /**
    * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
    * @param {Object} item The object to locate in the ReadOnlyCollection.
    * @returns {Number}
    */
    indexOf(item) {
        return this.list.indexOf(item);
    }

    /**
    * Returns a shallow copy of a portion of the list into a new array object.
    * @param {Number=} begin Zero-based index at which to begin extraction.
    * @param {Number=} end Zero-based index at which to end extraction
    * @returns {Array}
    */
    slice(begin = 0, end = undefined) {
        return ARRAY_PROTOTYPE.slice.call(this, begin, end === undefined ? this.length : end);
    }

    /**
    * Changes the content of the list by removing existing elements and/or adding new elements.
    * @param {Number} start Index at which to start changing the list.
    * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
    * @param {Object...} items The elements to add to the list.
    * @returns {Array}
    */
    splice(start, deleteCount, ...items) {
        return ARRAY_PROTOTYPE.splice.call(this, start, deleteCount, items);
    }

    /**
    * Buffers collection into an array.
    * @returns {Array}
    */
    toArray() {
        return this.list.toArray();
    }

    get [Symbol.toStringTag]() {
        return 'ReadOnly Collection';
    }

    toString() {
        return '[ReadOnly Collection]';
    }

    [Symbol.iterator]() {
        return new ArrayIterator(this);
    }
}
