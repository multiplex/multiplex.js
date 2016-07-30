import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function skipWhileIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function* () {
        let index = 0,
            yielding = false;

        for (let element of source) {
            if (!yielding && !predicate(element, index++)) {
                yielding = true;
            }

            if (yielding) {
                yield element;
            }
        }
    });
}
