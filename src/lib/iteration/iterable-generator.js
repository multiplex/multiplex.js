import Iterable from './iterable';

/**
* Creates a new GeneratorIterable instance.
* @param {Function|Function*} value A generator function.
*/
export default class GeneratorIterable extends Iterable {
    constructor(value) {
        super(value);
    }

    [Symbol.iterator]() {
        return this.valueOf()();
    }

    get [Symbol.toStringTag]() {
        return 'Generator Iterable';
    }

    toString() {
        return '[Generator Iterable]';
    }
}
