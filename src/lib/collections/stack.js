import Collection from './collection';
import buffer from '../utils/buffer';
import iterableSymbol from '../iteration/iterable-symbol';
import error, {ERROR_EMPTY_COLLECTION} from '../utils/error';

/**
* Initializes a new instance of the Stack class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
export default class Stack extends Collection {
    constructor(collection = null) {
        let items = collection ? buffer(collection) : [];
        super(items);
    }

    /**
    * Removes all objects from the Stack.
    */
    clear() {
        this[iterableSymbol].length = 0;
    }

    /**
    * Determines whether an element is in the Stack.
    * @param {Object} item The object to locate in the Stack.
    * @returns {Boolean}
    */
    contains(item) {
        return this[iterableSymbol].indexOf(item) !== -1;
    }

    /**
    * Returns the object at the top of the Stack without removing it.
    * @returns {Object}
    */
    peek() {
        let items = this[iterableSymbol];

        if (items.length > 0) {
            return items[this.length - 1];
        }

        error(ERROR_EMPTY_COLLECTION);
    }

    /**
    *   Removes and returns the object at the top of the Stack.
    *   @returns {Object}
    */
    pop() {
        if (this.count() > 0) {
            return this[iterableSymbol].pop();
        }

        error(ERROR_EMPTY_COLLECTION);
    }

    /**
    * Inserts an object at the top of the Stack.
    * @param {Object} item The object to push onto the Stack.
    */
    push(item) {
        this[iterableSymbol].push(item);
    }

    get [Symbol.toStringTag]() {
        return 'Stack';
    }

    toString() {
        return '[Stack]';
    }
}
