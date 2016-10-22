import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';
import isArrayLike from './is-array-like';
import assertType from './assert-type';
import $iterator from '../iteration/iterator-factory';

/**
* Gets number of items in the specified iterable object.
* @param {Iterable} value An Iterable object.
* @param {Function=} predicate A function to test each element for a condition. eg. function(item)
* @returns {Number}
*/
export default function count(value, predicate) {
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

    var it = $iterator(value),
        count = 0;

    if (predicate) {
        var next;
        assertType(predicate, Function);
        while (!(next = it.next()).done && predicate(next.value)) {
            count++;
        }
    }
    else {
        while (!it.next().done) {
            count++;
        }
    }

    return count;
}
