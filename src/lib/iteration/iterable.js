import iterator from './iterator-factory';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';

/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
* @returns {Iterable}
*/
export default function Iterable(source) {
    if (source != null) {
        this._source = source;
    }
}

Iterable.prototype[iteratorSymbol] = function () {
    return iterator(this._source);
};

mixin(Iterable.prototype, {
    toString: function () {
        return '[Iterable]';
    },

    valueOf: function () {
        return this._source == null ? this : this._source;
    }
});
