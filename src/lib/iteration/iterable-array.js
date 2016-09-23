import Iterable from './iterable';
import ArrayIterator from './iterator-array';
import isFunction from '../utils/is-function';
import iterableSymbol from './iterable-symbol';

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
export default class ArrayIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    /**
    * Creates an array from the Iterable.
    * @returns {Array}
    */
    toArray() {
        return this[iterableSymbol] || [];
    }

    [Symbol.iterator]() {
        let arr = this[iterableSymbol];
        return isFunction(arr[Symbol.iterator]) ? arr[Symbol.iterator]() : new ArrayIterator(arr);
    }

    get [Symbol.toStringTag]() {
        return 'Array Iterable';
    }

    toString() {
        return '[Array Iterable]';
    }
}
