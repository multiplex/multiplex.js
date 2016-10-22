import Iterable from './iterable';
import ArrayIterator from './iterator-array';
import extend from '../utils/extend';
import isFunction from '../utils/is-function';
import iterableSymbol from './iterable-symbol';
import iteratorSymbol from '../utils/iterator-symbol';

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
export default function ArrayIterable(value) {
    Iterable.call(this, value);
}

extend(ArrayIterable, Iterable, {
    /**
    * Creates an array from the Iterable.
    * @returns {Array}
    */
    toArray: function () {
        return this[iterableSymbol] || [];
    },

    toString: function () {
        return '[Array Iterable]';
    },

    '@@iterator': function () {
        var arr = this[iterableSymbol];
        return isFunction(arr[iteratorSymbol]) ? arr[iteratorSymbol]() : new ArrayIterator(arr);
    }
});
