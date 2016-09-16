import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function concatIterator(first, second) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var itFirst = $iterator(first),
            itSecond = $iterator(second),
            next;

        return new Iterator(function () {
            if (!(next = itFirst.next()).done || !(next = itSecond.next()).done) {
                return {
                    value: next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
