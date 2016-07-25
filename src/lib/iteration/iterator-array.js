import Iterator from './iterator';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Supports an iteration over an Array or Array-Like object.
* @param {Array|String|Array-like} arr An array or array-like object.
*/
export default function ArrayIterator(arr) {
    var index = -1,
        length = arr.length;

    Iterator.call(this, function () {
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

extend(ArrayIterator, Iterator);

mixin(ArrayIterator.prototype, {
    toString: function () {
        return '[Array Iterator]';
    }
});
