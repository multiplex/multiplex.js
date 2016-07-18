import Iterable from '../iteration/iterable';
import Collection from '../collections/collection';
import isFunction from './is-function';
import isString from './is-string';
import isArray from './is-array';
import isType from './is-type';

/**
* Buffers an Iterale object into an array.
* @param {Iterale} value An Iterale object.
* @returns {Array}
*/
export default function buffer(value) {
    value = value || [];

    if (isArray(value)) {                               // fast buffer arrays
        return value.concat();                          // 'concat' is fastest way to duplicate an array
    }

    else if (isString(value)) {                         // fast buffer strings
        return value.split('');                         // buffer string to char-array
    }

    else {
        if (isType(value, Iterable)) {
            let source = value.valueOf();

            if (isArray(source)) {                      // fast buffer array/string enumerable
                return source.concat();                 // 'concat' is fastest way to duplicate an array
            }
            else if (isString(source)) {                // fast buffer strings
                return source.split('');                // buffer string to char-array
            }
            else if (isFunction(source.slice)) {        // fast buffer enumerable with slice function: List
                return source.slice(0);
            }
        }

        // do it the hard way
        // collections have fixed element count
        if (value instanceof Collection) {
            let count = 0,
                arr = new Array(value.count());

            for (let element of value) {
                arr[count++] = element;
            }

            return arr;
        }
        else {
            let count = 0,
                length = 16,
                arr = new Array(length);

            for (let element of value) {
                if (count >= length) {
                    length *= 4;
                    arr.length = length;
                }

                arr[count++] = element;
            }

            arr.length = count;
            return arr;
        }
    }
}
