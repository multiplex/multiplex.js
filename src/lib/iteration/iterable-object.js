import Iterable from './iterable';
import Iterator from './iterator';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default class ObjectIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    [Symbol.iterator]() {
        return new ObjectIterator(this.valueOf());
    }

    get [Symbol.toStringTag]() {
        return 'Object Iterable';
    }

    toString() {
        return '[Object Iterable]';
    }
}


/**
* Supports an iteration over Object properties.
* @param {Object} obj An object instance.
*/
export class ObjectIterator extends Iterator {
    constructor(obj) {
        let index = -1,
            keys = Object.keys(obj),
            length = keys.length;

        // [key, value] iterator
        super(() => {
            if (++index < length) {
                return {
                    value: [
                        keys[index],
                        obj[keys[index]]
                    ],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }

    get [Symbol.toStringTag]() {
        return 'Object Iterator';
    }

    toString() {
        return '[Object Iterator]';
    }
}
