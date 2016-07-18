import iterator from './iterator-factory';

/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
* @returns {Iterable}
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

    static from(value) {
        return value instanceof Iterable ? value : new Iterable(value);
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this._source == null ? this : this._source;
    }
}
