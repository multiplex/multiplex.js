import Iterable from './iterable';
import ObjectIterator from './iterator-object';
import iterableSymbol from './iterable-symbol';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default class ObjectIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    [Symbol.iterator]() {
        return new ObjectIterator(this[iterableSymbol]);
    }

    get [Symbol.toStringTag]() {
        return 'Object Iterable';
    }

    toString() {
        return '[Object Iterable]';
    }
}

