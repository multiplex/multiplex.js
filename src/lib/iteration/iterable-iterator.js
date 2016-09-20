import Iterable from './iterable';
import extend from '../utils/extend';

/**
* Supports both iterable and iterator protocols using specified factory method.
* @param {Function} factory A function to create iterator instance.
*/
export default function IterableIterator(factory) {
    Iterable.call(this, factory);
    this.next = factory().next;
}

extend(IterableIterator, Iterable, {
    toString: function () {
        return '[Iterable Iterator]';
    }
});
