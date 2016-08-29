import Collection from './collection';
import buffer from '../utils/buffer';

export default class Queue extends Collection {
    constructor(collection = null) {
        let items = collection ? buffer(collection) : [];
        super(items);
    }

    get [Symbol.toStringTag]() {
        return 'Queue';
    }

    toString() {
        return '[Queue]';
    }
}
