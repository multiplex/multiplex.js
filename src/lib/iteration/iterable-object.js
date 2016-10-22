import Iterable from './iterable';
import ObjectIterator from './iterator-object';
import iterableSymbol from './iterable-symbol';
import extend from '../utils/extend';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default function ObjectIterable(value) {
    Iterable.call(this, value);
}

extend(ObjectIterable, Iterable, {
    toString: function () {
        return '[Object Iterable]';
    },

    '@@iterator': function () {
        return new ObjectIterator(this[iterableSymbol]);
    }
});
