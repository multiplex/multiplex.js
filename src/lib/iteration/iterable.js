/**
* Defines abstract Iterable class.
* @param {Object} source An Iterable object.
*/
export default class Iterable {
    constructor(source = null) {
        if (source != null) {
            this._source = source;
        }
    }

    [Symbol.iterator]() {
        return this._source[Symbol.iterator]();
    }

    get [Symbol.toStringTag]() {
        return 'Iterable';
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this._source;
    }
}

