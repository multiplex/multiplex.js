import iterator from './iterator-factory';

/**
* Defines abstract Iterable class.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
*/
export default class Iterable {
    constructor(source = null) {
        if (source != null) {
            this._source = source;
        }
    }

    [Symbol.iterator]() {
        return iterator(this._source);
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

