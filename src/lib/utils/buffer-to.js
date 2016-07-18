import assertType from './assert-type';
import assertNotNull from './assert-not-null';
import {arraySizeError} from './error';
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

    if (index > array.length || value.count() > array.length) {
        arraySizeError();
    }

    let arr = buffer(value),
        len = arr.length,
        i = -1;


    while (++i < len) {
        array[index + i] = arr[i];
    }
}
