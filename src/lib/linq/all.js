import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';

export default function allIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    var result = true;

    forOf(source, function (element) {
        if (!predicate(element)) {
            return result = false;
        }
    });

    return result;
}
