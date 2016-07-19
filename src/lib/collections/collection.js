import Iterable from '../iteration/iterable';
import bufferTo from '../utils/buffer-to';
import error, {ERROR_NOT_IMPLEMENTED} from '../utils/error';

/**
* Initializes a new instance of the abstract Collection class.
*/
export default class Collection extends Iterable {
    constructor() {
        // abstract class
        if (new.target === Collection) {
            error(ERROR_NOT_IMPLEMENTED);
        }
    }

    /**
    * Gets the number of elements contained in the Collection.
    * @returns {Number}
    */
    count() {
        // abstract method
        error(ERROR_NOT_IMPLEMENTED);
    }

    /**
    * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        bufferTo(this, array, arrayIndex);
    }
}
