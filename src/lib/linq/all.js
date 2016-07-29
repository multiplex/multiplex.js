import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function allIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    for (let element of source) {
        if (!predicate(element)) {
            return false;
        }
    }

    return true;
}
