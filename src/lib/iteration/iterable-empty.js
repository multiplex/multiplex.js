import Iterable from './iterable';
import EmptyIterator from './iterator-empty';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Creates a new EmptyIterable instance.
*/
export default function EmptyIterable() {
}

extend(EmptyIterable, Iterable);

EmptyIterable.prototype[iteratorSymbol] = function () {
    return new EmptyIterator();
};

mixin(EmptyIterable.prototype, {
    toString: function () {
        return '[Empty Iterable]';
    }
});
