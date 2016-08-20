import iterator from './iterator-factory';
import mixin from '../utils/mixin';

var iterableSource = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
    Symbol('iterable') : '@@iterable';

/**
* Defines abstract Iterable class.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
*/
export default function Iterable(source) {
    if (source !== null && source !== undefined) {
        this[iterableSource] = source;
    }
}

mixin(Iterable.prototype, {
    toString: function () {
        return '[Iterable]';
    },

    valueOf: function () {
        return this[iterableSource];
    },

    '@@iterator': function () {
        return iterator(this[iterableSource]);
    }
});
