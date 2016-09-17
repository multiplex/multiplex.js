import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function zipIterator(first, second, resultSelector) {
    assertNotNull(first);
    assertNotNull(second);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var it1 = $iterator(first),
            it2 = $iterator(second),
            next1,
            next2;

        return new Iterator(function () {
            if (!(next1 = it1.next()).done && !(next2 = it2.next()).done) {
                return {
                    value: resultSelector(next1.value, next2.value),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
