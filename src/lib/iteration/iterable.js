import iterator from './iterator-factory';

export default class Iterable {
    constructor(source = null) {
        if (source != null) {
            this._source = source;
        }
    }

    [Symbol.iterator]() {
        return iterator(this._source);
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this._source == null ? this : this._source;
    }
}
