import Collection from './collection';
import buffer from '../utils/buffer';
import extend from '../utils/extend';

/**
* Represents a doubly linked list.
* Initializes a new instance of the LinkedList class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
export default function LinkedList(collection) {
    this.size = 0;
    this.head = null;

    if (collection) {
        var arr = buffer(collection);
        for (var i = 0, len = arr.length; i < len; i++) {
            this.addLast(arr[i]);
        }
    }
}

extend(LinkedList, Collection, {
    toString: function () {
        return '[LinkedList]';
    }
});
