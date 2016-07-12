import iteratorSymbol from './iterator-symbol';
import iteratorFactory from './iterator-factory';

export default class Iterable {
    constructor(val) {
        this._val = val;
    }

    [iteratorSymbol]() {
        return iteratorFactory(this._val);
    }
}
