import iterator from './iterator-factory';
import iteratorSymbol from './iterator-symbol';

export default function Iterable(val) {
    this._source = val == null ? this : val;
}

Iterable.prototype[iteratorSymbol] = function () {
    return iterator(this._source);
};

Iterable.prototype.toString = function () {
    return '[Iterable]';
};

Iterable.prototype.valueOf = function () {
    return this._source;
};
