import iteratorSymbol from './iterator-symbol';
import iteratorFactory from './iterator-factory';

export default function Multiplex(obj) {
    this._iterable = obj;
}

Multiplex.prototype[iteratorSymbol] = function () {
    return iteratorFactory(this._iterable);
};
