import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';

export default class ReadOnlyCollection extends Collection {
    constructor(list) {
        super(list);
    }

    get [Symbol.toStringTag]() {
        return 'ReadOnly Collection';
    }

    toString() {
        return '[ReadOnly Collection]';
    }

    [Symbol.iterator]() {
        return new ArrayIterator(this);
    }
}
