import assertType from './assert-type';
import buffer from './buffer';
import error, {ERROR_ARRAY_SIZE, ERROR_ARGUMENT_OUT_OF_RANGE} from './error';

/**
* Buffers an Iterable instance into a given array.
* @param {Iterable} value An Iterable object.
* @param {Array} array The one-dimensional Array that is the destination of the elements copied from Iterable.
* @param {Number} index The zero-based index in array at which copying begins.
*/
export default function bufferTo(value, array, index) {
    assertType(array, Array);
    assertType(index, Number);

    var source = buffer(value),
        sourcelen = source.length,
        arraylen = array.length;

    if (index < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    if (index > arraylen || (sourcelen + index) > arraylen) {
        error(ERROR_ARRAY_SIZE);
    }

    while (sourcelen-- > 0) {
        array[index + sourcelen] = source[sourcelen];
    }
}
