import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function takeWhileIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function* () {
        let index = 0;

        for (let element of source) {
            if (!predicate(element, index++)) {
                break;
            }

            yield element;
        }
    });
}
