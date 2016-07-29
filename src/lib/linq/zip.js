import Iterable from '../iteration/iterable';
import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function zipIterator(first, second, resultSelector) {
    assertNotNull(first);
    assertNotNull(second);
    assertType(resultSelector, Function);

    return new Iterable(function* () {
        let it1 = iterator(first),
            it2 = iterator(second),
            next1,
            next2;

        while (!(next1 = it1.next()).done && !(next2 = it2.next()).done) {
            yield resultSelector(next1.value, next2.value);
        }
    });
}
