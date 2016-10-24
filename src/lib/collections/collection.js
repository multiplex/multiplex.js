import Iterable from '../iteration/iterable';
import ArrayIterator from '../iteration/iterator-array';
import iterableSymbol from '../iteration/iterable-symbol';
import extend from '../utils/extend';
import count from '../utils/count';
import buffer from '../utils/buffer';
import bufferTo from '../utils/buffer-to';
import isArrayLike from '../utils/is-array-like';

/**
 * Initializes a new instance of the abstract Collection class.
 */
export default function Collection(value) {
    if (value !== null && value !== undefined) {
        value = isArrayLike(value) ? value : buffer(value);
    }

    Iterable.call(this, value);
}

extend(Collection, Iterable, {
    /**
     * Gets the number of elements contained in the Collection.
     * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
     * @returns {Number}
     */
    count: function (predicate) {
        // if not overridden in subclass,
        // gets the count of the collection by converting the collection to an array
        return predicate ? count(this, predicate) : this.toArray().length;
    },

    /**
     * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
     * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
     * @param {Number} arrayIndex The zero-based index in array at which copying begins.
     */
    copyTo: function (array, arrayIndex) {
        bufferTo(this.toArray(), array, arrayIndex);
    },

    /**
    * Creates an array from the Iterable.
    * @returns {Array}
    */
    toArray: function () {
        // if the collection does not have an iterable value
        // converts the collection to an array buffering the collection
        return this[iterableSymbol] || buffer(this, true);
    },

    toString: function () {
        return '[Collection]';
    },

    '@@iterator': function () {
        // if not overridden in subclass,
        // gets the specified iterable's iterator or an empty iterator
        return new ArrayIterator(this[iterableSymbol] || []);
    }
});