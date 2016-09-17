import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function takeWhileIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done && predicate(next.value, index++)) {
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
