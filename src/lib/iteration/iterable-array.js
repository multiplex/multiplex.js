import Iterable from './iterable';
import Iterator from './iterator';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';
import extend from '../utils/extend';
import isFunction from '../utils/is-function';

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
export default function ArrayIterable(value) {
    Iterable.call(this, value);
}

extend(ArrayIterable, Iterable);

ArrayIterable.prototype[iteratorSymbol] = function () {
    var arr = this.valueOf();
    return isFunction(arr[iteratorSymbol]) ? arr[iteratorSymbol]() : new ArrayIterator(arr);
};

mixin(ArrayIterable.prototype, {
    toString: function () {
        return '[Array Iterable]';
    }
});


/**
* Supports an iteration over an Array or Array-Like object.
* @param {Array|String|Array-like} arr An array or array-like object.
*/
export function ArrayIterator(arr) {
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
