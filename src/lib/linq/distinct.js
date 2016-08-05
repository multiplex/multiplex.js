import Iterable from '../iteration/iterable';
import Set from '../collections/set';
import assertNotNull from '../utils/assert-not-null';

export default function distinctIterator(source, comparer = null) {
    assertNotNull(source);

    return new Iterable(function* () {
        let set = new Set(comparer);

        for (let element in source) {
            if (set.add(element)) {
                yield element;
            }
        }
    });
}

