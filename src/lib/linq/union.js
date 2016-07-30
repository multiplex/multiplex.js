import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertNotNull from '../utils/assert-not-null';
import HashSet from '../collections/hash-set';
import EqualityComparer from '../collections/equality-comparer';

export default function unionIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);
    comparer = EqualityComparer.from(comparer);

    return new Iterable(function () {
        var set = new HashSet(comparer),
            it1 = iterator(first),
            it2 = iterator(second),
            next1,
            next2;

        return new Iterator(function () {
            while (!(next1 = it1.next()).done) {
                if (set.add(next1.value)) {
                    return {
                        value: next1.value,
                        done: false
                    };
                }
            }

            while (!(next2 = it2.next()).done) {
                if (set.add(next2.value)) {
                    return {
                        value: next2.value,
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
