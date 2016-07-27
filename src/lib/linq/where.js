import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';

export default function whereIterator(source, predicate) {
    assertType(predicate, Function);

    return new Iterable(function* () {
        let index = 0;

        for (let element of source) {
            if (predicate(element, index++)) {
                yield element;
            }
        }
    });
}
