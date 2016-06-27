import assertType from '../utils/assert-type';

/**
* Supports a simple iteration over an Iterable .
* @param {Function} factory A function to yield the next item in the sequence.
*/
export default class Iterable {
    constructor(factory) {
        assertType(factory, Function);
        this.next = factory;
    }
}
