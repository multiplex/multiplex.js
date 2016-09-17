import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function joinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(inner, innerKeySelector, null, comparer),
            it = $iterator(outer),
            elements = null,
            index = 0,
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done) {
                if (elements === null) {
                    elements = lookup.get(outerKeySelector(next.value)).elements;
                }
                if (index < elements.length) {
                    return {
                        value: resultSelector(next.value, elements[index++]),
                        done: false
                    };
                }
                else {
                    index = 0;
                    elements = null;
                }
            }
            return {
                done: true
            };
        });
    });
}
