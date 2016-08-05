import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import Set from '../collections/set';
import iterator from '../iteration/iterator-factory';
import assertNotNull from '../utils/assert-not-null';

export default function unionIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var set = new Set(comparer),
            it1 = iterator(first),
            it2 = iterator(second),
            next;

        return new Iterator(function () {
            while (!(next = it1.next()).done || !(next = it2.next()).done) {
                if (set.add(next.value)) {
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
