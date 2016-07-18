import Iterable from '../iteration/iterable';
import mixin from '../utils/mixin';
import extend from '../utils/extend';
import buffer from '../utils/buffer';
import bufferTo from '../utils/buffer-to';

/**
* Initializes a new instance of the abstract Collection class.
* @param {Iterable=} value Iterable whose elements are copied to the new collection.
*/
export default function Collection(value) {
    Iterable.call(this, buffer(value));
}

extend(Collection, extend);

mixin(Collection, {
    /**
    * Gets the number of elements contained in the Collection.
    * @returns {Number}
    */
    count: function () {
        return this.valueOf().length;
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

