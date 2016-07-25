import Iterable from './iterable';
import Iterator from './iterator';
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


/**
* Supports an iteration over an Array or Array-Like object.
* @param {Array|String|Array-like} arr An array or array-like object.
*/
export class ArrayIterator extends Iterator {
    constructor(arr) {
        let index = -1,
            length = arr.length;

        super(() => {
            if (++index < length) {
                return {
                    value: arr[index],
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }

    get [Symbol.toStringTag]() {
        return 'Array Iterator';
    }

    toString() {
        return '[Array Iterator]';
    }
}
