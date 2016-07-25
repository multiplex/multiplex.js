import assertType from '../utils/assert-type';

/**
* Supports an iteration over an object using specified factory method.
* @param {Function} factory A function to yield the next item in the sequence.
*/
export default class Iterator {
    constructor(factory) {
        assertType(factory, Function);
        this.next = factory;
    }

    get [Symbol.toStringTag]() {
        return 'Iterator';
    }

    toString() {
        return '[Iterator]';
    }
}
