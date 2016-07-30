import forOf from '../utils/for-of';
import assertNotNull from '../utils/assert-not-null';
import EqualityComparer from '../collections/equality-comparer';

export default function containsIterator(source, value, comparer) {
    assertNotNull(source);
    comparer = EqualityComparer.from(comparer);

    var result = false;

    forOf(source, function (element) {
        if (comparer.equals(element, value)) {
            result = true;
            return result;
        }
    });

    return result;
}
