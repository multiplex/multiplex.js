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
    let count = 0;

    if (!predicate) {
        count = collectionCount(value);
        if (count !== -1) {
            return count;
        }
    }

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


/**
* Gets number of items in the specified collection object. returns -1 if the value is not a collection.
* @returns {Number}
*/
export function collectionCount(value) {
    if (isArrayLike(value)) {
        return value.length;
    }

    else if (value instanceof ArrayIterable) {
        return value.toArray().length;
    }

    else if (value instanceof Collection) {
        return value.count();
    }

    return -1;
}