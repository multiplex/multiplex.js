import $iterator from './iterator-factory';
import iterableSymbol from './iterable-symbol';

/**
* Defines abstract Iterable class.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
*/
export default class Iterable {
    constructor(source = null) {
        if (source !== null && source !== undefined) {
            this[iterableSymbol] = source;
        }
    }

    get [Symbol.toStringTag]() {
        return 'Iterable';
    }

    toString() {
        return '[Iterable]';
    }

    valueOf() {
        return this[iterableSymbol];
    }

    [Symbol.iterator]() {
        return $iterator(this[iterableSymbol]);
    }
}

