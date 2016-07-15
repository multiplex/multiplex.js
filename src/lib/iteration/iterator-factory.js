import iteratorSymbol from './iterator-symbol';
import isFunction from '../utils/is-function';
import isArrayLike from '../utils/is-array-like';
import {ArrayIterator, ObjectIterator, EmptyIterator} from './iterator';


/**
* Creates an iterator object
* @param {Object} obj An object to create iterator from.
*/
export default function iterator (obj) {
    // empty iteration
    if (obj === null || obj === undefined) {
        return new EmptyIterator();
    }

    // iterable/generator function
    else if (isFunction(obj)) {
        return obj();
    }

    // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
    else if (isFunction(obj[iteratorSymbol])) {
        return obj[iteratorSymbol]();
    }

    // array-like objects
    else if (isArrayLike(obj)) {
        return new ArrayIterator(obj);
    }

    // Object.entries iterator
    else if (typeof obj === 'object') {
        return new ObjectIterator(obj);
    }

    // simple iterator over non-objects
    else {
        return new ArrayIterator([obj]);
    }
}
