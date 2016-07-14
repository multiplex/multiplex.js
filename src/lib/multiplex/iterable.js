import iteratorFactory from './iterator-factory';

export default class Iterable {
    constructor(val) {
        this._val = val;
    }

    [Symbol.iterator]() {
        return iteratorFactory(this._val);
    }

    get [Symbol.toStringTag]() {
        return 'Iterable';
    }
}
