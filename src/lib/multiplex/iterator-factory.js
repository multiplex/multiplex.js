import Iterator from './iterator';
import iteratorSymbol from './iterator-symbol';
import isFunc from '../utils/is-function';
import isArrayLike from '../utils/is-array-like';

export default function iteratorFactory(obj) {
    obj = obj || [];


    /// iterable/generator function
    if (isFunc(obj)) {
        return obj();
    }


    // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
    else if (isFunc(obj[iteratorSymbol])) {
        return obj[iteratorSymbol]();
    }


    // array-like objects
    else if (isArrayLike(obj)) {
        var _index = -1,
            _length = obj.length;

        return new Iterator(function () {
            if (++_index < _length) {
                return {
                    value: obj[_index],
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }


    // Object.entries iterator
    else if (typeof obj === 'object') {
        var _index = -1,
            _keys = Object.keys(obj),
            _length = _keys.length;

        // [key, value] iterator
        return new Iterator(function () {
            if (++_index < _length) {
                return {
                    value: [
                        _keys[_index],
                        obj[_keys[_index]]
                    ],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }


    // simple iterator over non-objects
    return iteratorFactory([obj]);
}
