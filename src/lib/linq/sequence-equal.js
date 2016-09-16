import assertNotNull from '../utils/assert-not-null';
import EqualityComparer from '../collections/equality-comparer';
import $iterator from '../iteration/iterator-factory';

export default function sequenceEqualIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);
    comparer = EqualityComparer.from(comparer);

    var it1 = $iterator(first),
        it2 = $iterator(second),
        next1,
        next2;

    while (!(next1 = it1.next()).done) {
        if ((next2 = it2.next()).done || !comparer.equals(next1.value, next2.value)) {
            return false;
        }
    }

    if (!it2.next().done) {
        return false;
    }

    return true;
}
