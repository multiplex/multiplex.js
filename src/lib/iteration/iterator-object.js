import Iterator from './iterator';
import extend from '../utils/extend';

/**
* Supports an iteration over Object properties.
* @param {Object} obj An object instance.
*/
export default function ObjectIterator(obj) {
    var index = -1,
        keys = Object.keys(obj),
        length = keys.length;

    // [key, value] iterator
    Iterator.call(this, function () {
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

extend(ObjectIterator, Iterator, {
    toString: function () {
        return '[Object Iterator]';
    }
});
