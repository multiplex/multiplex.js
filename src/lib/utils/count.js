import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';
import isArrayLike from './is-array-like';
import assertType from './assert-type';
import $iterable from '../iteration/iterable-factory';

/**
* Gets number of items in the specified iterable object.
* @param {Iterable} value An Iterable object.
* @param {Function=} predicate A function to test each element for a condition. eg. function(item)
* @returns {Number}
*/
export default function count(value, predicate = undefined) {
    if (!predicate) {
        if (isArrayLike(value)) {
            return value.length;
        }

        else if (value instanceof ArrayIterable) {
            return value.toArray().length;
        }

        else if (value instanceof Collection) {
            return value.count();
        }
    }

    let count = 0;

    if (predicate) {
        assertType(predicate, Function);
        for (let element of $iterable(value)) {
            if (predicate(element)) {
                count++;
            }
        }
    }
    else {
        /*jshint unused:false*/
        for (let element of $iterable(value)) {
            count++;
        }
    }

    return count;
}
