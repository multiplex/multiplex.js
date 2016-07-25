import Iterable from './iterable';
import ArrayIterator from './iterator-array';
import isFunction from '../utils/is-function';

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
export default class ArrayIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    [Symbol.iterator]() {
        let arr = this.valueOf();
        return isFunction(arr[Symbol.iterator]) ? arr[Symbol.iterator]() : new ArrayIterator(arr);
    }

    get [Symbol.toStringTag]() {
        return 'Array Iterable';
    }

    toString() {
        return '[Array Iterable]';
    }
}
