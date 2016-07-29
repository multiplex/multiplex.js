import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertNotNull from '../utils/assert-not-null';

export default function concatIterator(first, second) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var itFirst = iterator(first),
            itSecond = iterator(second),
            result;

        return new Iterator(function () {
            if (!(result = itFirst.next()).done) {
                return {
                    value: result.value,
                    done: false
                };
            }
            if (!(result = itSecond.next()).done) {
                return {
                    value: result.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
