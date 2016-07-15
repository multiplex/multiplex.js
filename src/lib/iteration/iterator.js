import assertType from '../utils/assert-type';

/**
* Supports an iteration over an object using specified factory method.
* @param {Function} factory A function to yield the next item in the sequence.
*/
export default class Iterator {
    constructor(factory) {
        assertType(factory, Function);
        this.next = factory;
    }
}


/**
* Supports an iteration over an Array or Array-Like.
* @param {Array} arr An array or array-like object.
*/
export class ArrayIterator extends Iterator {
    constructor(arr) {
        let _index = -1,
            _length = arr.length;

        super(() => {
            if (++_index < _length) {
                return {
                    value: arr[_index],
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
}


/**
* Supports an iteration over an Object.
* @param {Object} obj An object instance.
*/
export class ObjectIterator extends Iterator {
    constructor(obj) {
        let _index = -1,
            _keys = Object.keys(obj),
            _length = _keys.length;

        // [key, value] iterator
        super(() => {
            if (++_index < _length) {
                return {
                    value: [
                        _keys[_index],
                        obj[_keys[_index]]
                    ],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }
}


/**
* Creates an empty iteration.
*/
export class EmptyIterator extends Iterator {
    constructor() {
        super(() => ({ done: true }));
    }
}
