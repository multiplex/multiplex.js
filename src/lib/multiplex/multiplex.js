import iteratorSymbol from './iterator-symbol';
import iteratorFactory from './iterator-factory';

export default class Multiplex {
    constructor(obj) {
        this._iterable = obj;
    }

    [iteratorSymbol]() {
        return iteratorFactory(this._iterable);
    }
}
