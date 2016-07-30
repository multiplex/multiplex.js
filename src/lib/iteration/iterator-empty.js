import Iterator from './iterator';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Supports an iteration over an empty Iterable.
*/
export default function EmptyIterator() {
    Iterator.call(this, function () {
        return { done: true };
    });
}

extend(EmptyIterator, Iterator);

mixin(EmptyIterator.prototype, {
    toString: function () {
        return '[Empty Iterator]';
    }
});
