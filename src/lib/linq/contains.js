import assertNotNull from '../utils/assert-not-null';
import EqualityComparer from '../collections/equality-comparer';

export default function containsIterator(source, value, comparer = null) {
    assertNotNull(source);
    comparer = EqualityComparer.from(comparer);

    for (let element of source) {
        if (comparer.equals(element, value)) {
            return true;
        }
    }

    return false;
}
