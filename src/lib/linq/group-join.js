import Iterable from '../iteration/iterable';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function groupJoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer = null) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function* () {
        let lookup = new Lookup(inner, innerKeySelector, null, comparer);

        for (let element in outer) {
            yield resultSelector(element, lookup.get(outerKeySelector(element)));
        }
    });
}
