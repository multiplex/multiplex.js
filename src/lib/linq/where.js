import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function whereIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = iterator(source),
            index = 0,
            result;

        return new Iterator(function () {
            if (!(result = it.next()).done) {
                if (predicate(result.value, index++)) {
                    return {
                        value: result.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}
