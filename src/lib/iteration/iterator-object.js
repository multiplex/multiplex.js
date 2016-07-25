import Iterator from './iterator';

/**
* Supports an iteration over Object properties.
* @param {Object} obj An object instance.
*/
export default class ObjectIterator extends Iterator {
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
