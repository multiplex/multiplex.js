import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function selectIterator(source, selector) {
    assertNotNull(source);
    assertType(selector, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                return {
                    value: selector(next.value, index++),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
