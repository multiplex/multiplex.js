import iteratorSymbol from './iterator-symbol';
import iteratorFactory from './iterator-factory';

export default function Iterable(val) {
    this._val = val;
}

Iterable.prototype[iteratorSymbol] = function () {
    return iteratorFactory(this._val);
};
