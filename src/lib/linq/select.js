import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function selectIterator(source, selector) {
    assertNotNull(source);
    assertType(selector, Function);

    return new Iterable(function () {
        var it = iterator(source),
            index = 0,
            result;

        return new Iterator(function () {
            if (!(result = it.next()).done) {
                return {
                    value: selector(result.value, index++),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
