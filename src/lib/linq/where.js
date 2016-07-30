import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function whereIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                if (predicate(next.value, index++)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}
