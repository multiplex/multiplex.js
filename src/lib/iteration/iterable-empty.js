import Iterable from './iterable';
import Iterator from './iterator';

/**
* Creates a new EmptyIterable instance.
*/
export default class EmptyIterable extends Iterable {
    constructor() {
        super();
    }

    [Symbol.iterator]() {
        return new Iterator(() => ({ done: true }));
    }

    get [Symbol.toStringTag]() {
        return 'Empty Iterable';
    }

    toString() {
        return '[Empty Iterable]';
    }
}
