import isObject from '../utils/is-object';
import isFunction from '../utils/is-function';
import isArrayLike from '../utils/is-array-like';
import ArrayIterator from './iterator-array';
import ObjectIterator from './iterator-object';
import EmptyIterator from './iterator-empty';
import EnumerableIterator from './iterator-enumerable';
import iteratorSymbol from '../utils/iterator-symbol';

/**
* Creates an iterator object
* @param {Object} obj An object to create iterator from.
*/
export default function $iterator(obj) {
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

    // .Net Enumerable
    else if (isFunction(obj.getEnumerator)) {
        return new EnumerableIterator(obj);
    }

    // Object.entries iterator
    else if (isObject(obj)) {
        return new ObjectIterator(obj);
    }

    // simple iterator over non-objects
    else {
        return new ArrayIterator([obj]);
    }
}
