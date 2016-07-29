import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function allIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    var it = iterator(source),
        next;

    while (!(next = it.next()).done) {
        if (!predicate(next.value)) {
            return false;
        }
    }

    return true;
}
