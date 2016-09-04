import Collection from './collection';
import buffer from '../utils/buffer';

export default class SortedList extends Collection {
    constructor(collection = null) {
        let items = collection ? buffer(collection) : [];
        super(items);
    }

    get [Symbol.toStringTag]() {
        return 'Sorted List';
    }

    toString() {
        return '[Sorted List]';
    }
}
