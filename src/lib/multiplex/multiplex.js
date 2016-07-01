import Iterator from './iterator';
import iteratorSymbol from './iterator-symbol';
import isArrayLike from '../utils/is-array-like';

export default function Multiplex(obj) {
    this._iterable = obj;
}

Multiplex.prototype[iteratorSymbol] = function () {
    return iteratorFactory(this._iterable);
};


function iteratorFactory(obj) {
    obj = obj || [];


    /// iterable/generator function
    if (typeof obj === 'function') {
        return obj();
    }


    // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
    else if (typeof obj[iteratorSymbol] === 'function') {
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


    else {
        // simple iterator over non-objects
        if (typeof obj !== 'object') {
            return iteratorFactory([obj]);
        }

        var _index = -1,
            _keys = Object.keys(obj),
            _length = _keys.length;

        // key-value iterator
        return new Iterator(function () {
            if (++_index < _length) {
                return {
                    value: {
                        key: _keys[_index],
                        value: obj[_keys[_index]]
                    },
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }
}
