import Iterator from './iterator';

/**
* Supports an iteration over an empty Iterable.
*/
export default class EmptyIterator extends Iterator {
    constructor() {
        super(() => ({ done: true }));
    }

    get [Symbol.toStringTag]() {
        return 'Empty Iterator';
    }

    toString() {
        return '[Empty Iterator]';
    }
}
