import Iterable from './iterable';
import ArrayIterator from './iterator-array';
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

