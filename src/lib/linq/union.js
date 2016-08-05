import Iterable from '../iteration/iterable';
import Set from '../collections/set';
import assertNotNull from '../utils/assert-not-null';

export default function unionIterator(first, second, comparer = null) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function* () {
        let set = new Set(comparer);

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
