import Iterable from './iterable';

/**
* Supports both iterable and iterator protocols using specified factory method.
* @param {Function} factory A function to create iterator instance.
*/
export default class IterableIterator extends Iterable {
    constructor(factory) {
        super(factory);
        this.next = factory().next;
    }

    get [Symbol.toStringTag]() {
        return 'Iterable Iterator';
    }

    toString() {
        return '[Iterable Iterator]';
    }
}
