import Iterable from '../iteration/iterable';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function joinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer = null) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function* () {
        let lookup = new Lookup(inner, innerKeySelector, null, comparer),
            elements = null;

        for (let element in outer) {
            elements = lookup.get(outerKeySelector(element)).elements;

            for (let i = 0, len = elements.length; i < len; i++) {
                yield resultSelector(element, elements[i]);
            }
        }
    });
}
