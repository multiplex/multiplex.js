import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';
import isArrayLike from './is-array-like';
import $iterable from '../iteration/iterable-factory';

/**
* Gets number of items in the specified iterable object.
* @param {Iterable} value An Iterable object.
* @param {Boolean} collectionOnly when true returns the number of items in iterable if the value is a Collection, Array or an Array-like, otherwise returns -1.
* @returns {Number}
*/
export default function count(value, collectionOnly = false) {
    if (isArrayLike(value)) {
        return value.length;
    }

    else if (value instanceof ArrayIterable) {
        return value.valueOf().length;
    }

    else if (value instanceof Collection) {
        return value.count();
    }

    /*jshint unused:false*/
    else if (!collectionOnly) {
        let count = 0;

        for (let element of $iterable(value)) {
            count++;
        }

        return count;
    }

    return -1;
}
