import Iterable from './iterable';
import ObjectIterator from './iterator-object';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default class ObjectIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    [Symbol.iterator]() {
        return new ObjectIterator(this.valueOf());
    }

    get [Symbol.toStringTag]() {
        return 'Object Iterable';
    }

    toString() {
        return '[Object Iterable]';
    }
}

