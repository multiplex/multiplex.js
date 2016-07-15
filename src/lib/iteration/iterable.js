import iterator from './iterator-factory';
import iteratorSymbol from './iterator-symbol';

export default function Iterable(source) {
    if (source != null) {
        this._source = source;
    }
}

Iterable.prototype[iteratorSymbol] = function () {
    return iterator(this._source);
};

Iterable.prototype.toString = function () {
    return '[Iterable]';
};

Iterable.prototype.valueOf = function () {
    return this._source == null ? this : this._source;
};
