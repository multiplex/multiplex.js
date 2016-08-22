import Iterable from './iterable';
import assertType from '../utils/assert-type';
import extend from '../utils/extend';

/**
* Supports both iterable and iterator protocols using specified factory method.
* @param {Function} factory A function to create iterator instance.
*/
export default function IterableIterator(factory) {
    assertType(factory, Function);
    Iterable.call(this, factory);
}

extend(IterableIterator, Iterable, {
    next: function () {
        var iterator = this.iterator;
        if (iterator === undefined) {
            iterator = this.valueOf()();
            this.iterator = iterator;
        }
        return iterator.next();
    },

    toString: function () {
        return '[Iterable Iterator]';
    },

    '@@iterator': function () {
        return new IterableIterator(this.valueOf());
    }
});
