import ArrayIterable from '../iteration/iterable';
import buffer from '../utils/buffer';
import bufferTo from '../utils/buffer-to';

/**
* Initializes a new instance of the abstract Collection class.
* @param {Iterable=} value Iterable whose elements are copied to the new collection.
*/
export default class Collection extends ArrayIterable {
    constructor(value = null) {
        if (value != null) {
            value = buffer(value);
        }

        super(value);
    }

    /**
    * Gets the number of elements contained in the Collection.
    * @returns {Number}
    */
    count() {
        return (this.valueOf() || []).length;
    }

    /**
    * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        bufferTo(this.valueOf() || [], array, arrayIndex);
    }

    /**
    * Creates an array of the elements from Collection.
    * @returns {Array}
    */
    toArray() {
        return (this.valueOf() || []).concat();
    }

    get [Symbol.toStringTag]() {
        return 'Collection';
    }

    toString() {
        return '[Collection]';
    }
}
