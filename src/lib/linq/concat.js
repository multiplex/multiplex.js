import Iterable from '../iteration/iterable';
import assertNotNull from '../utils/assert-not-null';

export default function concatIterator(first, second) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function* () {
        for (let element of first) {
            yield element;
        }

        for (let element of second) {
            yield element;
        }
    });
}
