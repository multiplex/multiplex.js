import iterator from './iterator-factory';

const IterableSource = Symbol('iterable');

/**
* Defines abstract Iterable class.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
*/
export default class Iterable {
    constructor(source = null) {
        if (source !== null && source !== undefined) {
            this[IterableSource] = source;
        }
    }

    [Symbol.iterator]() {
        return iterator(this[IterableSource]);
    }

    get [Symbol.toStringTag]() {
        return 'Iterable';
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this[IterableSource];
    }
}

