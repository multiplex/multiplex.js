import Iterable from '../iteration/iterable';
import assertNotNull from '../utils/assert-not-null';
import HashSet from '../collections/hash-set';
import EqualityComparer from '../collections/equality-comparer';

export default function unionIterator(first, second, comparer = null) {
    assertNotNull(first);
    assertNotNull(second);
    comparer = EqualityComparer.from(comparer);

    return new Iterable(function* () {
        let set = new HashSet(comparer);

        for (let element of first) {
            if (set.add(element)) {
                yield element;
            }
        }

        for (let element of second) {
            if (set.add(element)) {
                yield element;
            }
        }
    });
}
