import Collection from './collection';
import buffer from '../utils/buffer';

/**
* Represents a doubly linked list.
*/
export default class LinkedList extends Collection {
    /**
    * Initializes a new instance of the LinkedList class that that is empty or contains elements copied from the specified collection.
    * @param {Iterable=} collection The collection to copy elements from.
    */
    constructor(collection = null) {
        super();
        this.size = 0;
        this.head = null;

        if (collection) {
            let arr = buffer(collection);
            for (let i = 0, len = arr.length; i < len; i++) {
                this.addLast(arr[i]);
            }
        }
    }

    get [Symbol.toStringTag]() {
        return 'LinkedList';
    }

    toString() {
        return '[LinkedList]';
    }
}
