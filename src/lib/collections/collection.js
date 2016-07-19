import Iterable from '../iteration/iterable';
import mixin from '../utils/mixin';
import extend from '../utils/extend';
import bufferTo from '../utils/buffer-to';
import error, {ERROR_NOT_IMPLEMENTED} from '../utils/error';

/**
* Initializes a new instance of the abstract Collection class.
*/
export default function Collection() {
}

extend(Collection, Iterable);

mixin(Collection.prototype, {
    /**
    * Gets the number of elements contained in the Collection.
    * @returns {Number}
    */
    count: function () {
        // abstract method
        error(ERROR_NOT_IMPLEMENTED);
    },

    /**
    * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo: function (array, arrayIndex) {
        bufferTo(this.valueOf(), array, arrayIndex);
    }
});

