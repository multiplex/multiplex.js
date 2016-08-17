import Iterator from './iterator';
import extend from '../utils/extend';

/**
* Supports an iteration over an empty Iterable.
*/
export default function EmptyIterator() {
    Iterator.call(this, function () {
        return { done: true };
    });
}

extend(EmptyIterator, Iterator, {
    toString: function () {
        return '[Empty Iterator]';
    }
});
