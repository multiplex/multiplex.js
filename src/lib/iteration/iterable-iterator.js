import Iterable from './iterable';
import assertType from '../utils/assert-type';

/**
* Supports both iterable and iterator protocols using specified factory method.
* @param {Function} factory A function to create iterator instance.
*/
export default class IterableIterator extends Iterable {
    constructor(factory) {
        assertType(factory, Function);
        super(factory);
    }

    next() {
        let iterator = this.iterator;
        if (iterator === undefined) {
            iterator = this.valueOf()();
            this.iterator = iterator;
        }
        return iterator.next();
    }

    [Symbol.iterator]() {
        return new IterableIterator(this.valueOf());
    }

    get [Symbol.toStringTag]() {
        return 'Iterable Iterator';
    }

    toString() {
        return '[Iterable Iterator]';
    }
}
