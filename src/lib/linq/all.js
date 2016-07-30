import forOf from '../utils/for-of';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function allIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    var result = true;

    forOf(source, function (element) {
        if (!predicate(element)) {
            result = false;
            return result;
        }
    });

    return result;
}
