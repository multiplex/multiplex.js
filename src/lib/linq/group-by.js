import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function groupIterator(source, keySelector, elementSelector, resultSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(source, keySelector, elementSelector, comparer),
            it = iterator(lookup),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                return {
                    value: resultSelector ? resultSelector(next.value.key, next.value) : next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
