import Iterable from './iterable';
import ArrayIterator from './iterator-array';
import extend from '../utils/extend';
import isFunction from '../utils/is-function';
import iteratorSymbol from '../utils/iterator-symbol';

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
export default function ArrayIterable(value) {
    Iterable.call(this, value);
}

extend(ArrayIterable, Iterable, {
    toString: function () {
        return '[Array Iterable]';
    },

    '@@iterator': function () {
        var arr = this.valueOf();
        return isFunction(arr[iteratorSymbol]) ? arr[iteratorSymbol]() : new ArrayIterator(arr);
    }
});
