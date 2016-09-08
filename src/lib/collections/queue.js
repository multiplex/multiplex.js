import Collection from './collection';
import buffer from '../utils/buffer';
import extend from '../utils/extend';
import iterableSymbol from '../iteration/iterable-symbol';
import error, {ERROR_EMPTY_COLLECTION} from '../utils/error';

/**
* Initializes a new instance of the Queue class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
export default function Queue(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(Queue, Collection, {
    /**
    * Removes all objects from the Stack.
    */
    clear: function () {
        this[iterableSymbol].length = 0;
    },

    /**
    * Determines whether an element is in the Stack.
    * @param {Object} item The object to locate in the Stack.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this[iterableSymbol].indexOf(item) !== -1;
    },

    /**
    * Removes and returns the object at the beginning of the Queue.
    * @returns {Object}
    */
    dequeue: function () {
        if (this.count() > 0) {
            return this[iterableSymbol].shift();
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    /**
    * Adds an object to the end of the Queue.
    * @param {Object} item The object to add to the Queue.
    */
    enqueue: function (item) {
        this[iterableSymbol].push(item);
    },

    /**
    * Returns the object at the beginning of the Queue without removing it.
    * @returns {Object}
    */
    peek: function () {
        var items = this[iterableSymbol];

        if (items.length > 0) {
            return items[this.length - 1];
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    toString: function () {
        return '[Queue]';
    }
});
