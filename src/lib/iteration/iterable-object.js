import Iterable from './iterable';
import Iterator from './iterator';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default function ObjectIterable(value) {
    Iterable.call(this, value);
}

extend(ObjectIterable, Iterable);

ObjectIterable.prototype[iteratorSymbol] = function () {
    return new ObjectIterator(this.valueOf());
};

mixin(ObjectIterable.prototype, {
    toString: function () {
        return '[Object Iterable]';
    }
});


/**
* Supports an iteration over Object properties.
* @param {Object} obj An object instance.
*/
export function ObjectIterator(obj) {
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

extend(ObjectIterator, Iterator);

mixin(ObjectIterator.prototype, {
    toString: function () {
        return '[Object Iterator]';
    }
});

