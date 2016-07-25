import assertType from './assert-type';
import assertNotNull from './assert-not-null';
import error, {ERROR_ARRAY_SIZE} from './error';
import buffer from './buffer';

/**
* Buffers an Iterable instance into a given array.
* @param {Iterable} value An Iterable object.
* @param {Array} array The one-dimensional Array that is the destination of the elements copied from Iterable.
* @param {Number} index The zero-based index in array at which copying begins.
*/
export default function bufferTo(value, array, index) {
    assertNotNull(array);
    assertType(index, Number);

    let source = buffer(value),
        sourcelen = source.length,
        arraylen = array.length;

    if (index > arraylen || sourcelen > arraylen) {
        error(ERROR_ARRAY_SIZE);
    }

    while (sourcelen-- > 0) {
        array[index + sourcelen] = source[sourcelen];
    }
}
