import Iterable from './iterable';
import ObjectIterator from './iterator-object';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
export default function ObjectIterable(value) {
    Iterable.call(this, value);
}

extend(ObjectIterable, Iterable);

ObjectIterable.prototype[iteratorSymbol] = function () {
    return new ObjectIterator(this.valueOf());
};

mixin(ObjectIterable.prototype, {
    toString: function () {
        return '[Object Iterable]';
    }
});

