import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function anyIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    for (let element of source) {
        if (predicate(element)) {
            return true;
        }
    }

    return false;
}
