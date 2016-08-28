import Collection from './collection';
import buffer from '../utils/buffer';

export default class Stack extends Collection {
    constructor(collection = null) {
        let items = collection ? buffer(collection) : [];
        super(items);
    }

    get [Symbol.toStringTag]() {
        return 'Stack';
    }

    toString() {
        return '[Stack]';
    }
}
