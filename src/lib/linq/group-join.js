import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function groupJoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(inner, innerKeySelector, null, comparer),
            it = $iterator(outer),
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done) {
                return {
                    value: resultSelector(next.value, lookup.get(outerKeySelector(next.value))),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
