import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';

/**
* Defines abstract Iterable class.
* @param {Object} source An Iterable object.
*/
export default function Iterable(source) {
    if (source != null) {
        this._source = source;
    }
}

Iterable.prototype[iteratorSymbol] = function () {
    return this._source[Symbol.iterator]();
};

mixin(Iterable.prototype, {
    toString: function () {
        return '[Iterable]';
    },

    valueOf: function () {
        return this._source;
    }
});
