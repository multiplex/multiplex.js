import Iterator from './iterator';

/**
* Supports an iteration over an Array or Array-Like object.
* @param {Array|String|Array-like} arr An array or array-like object.
*/
export default class ArrayIterator extends Iterator {
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
