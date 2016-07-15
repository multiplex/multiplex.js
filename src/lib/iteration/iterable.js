import iterator from './iterator-factory';

export default class Iterable {
    constructor(val) {
        this._val = val;
    }

    [Symbol.iterator]() {
        return iterator(this._val);
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this._val;
    }
}
