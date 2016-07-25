import Iterable from './iterable';
import EmptyIterator from './iterator-empty';

/**
* Creates a new EmptyIterable instance.
*/
export default class EmptyIterable extends Iterable {
    constructor() {
        super();
    }

    [Symbol.iterator]() {
        return new EmptyIterator();
    }

    get [Symbol.toStringTag]() {
        return 'Empty Iterable';
    }

    toString() {
        return '[Empty Iterable]';
    }
}
