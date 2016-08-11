import Iterable from '../iteration/iterable';
import Lookup from '../collections/lookup';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function groupIterator(source, keySelector, elementSelector, resultSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    return new Iterable(function* () {
        let lookup = new Lookup(source, keySelector, elementSelector, comparer);

        for (let element of lookup) {
            yield resultSelector ? resultSelector(element.key, element) : element;
        }
    });
}
