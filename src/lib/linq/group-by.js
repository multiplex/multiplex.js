import Iterable from '../iteration/iterable';
import Lookup from '../collections/lookup';
import isFunction from '../utils/is-function';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function groupIterator(source, keySelector, elementSelectorOrComparer = null, resultSelectorOrComparer = null, comparer = null) {
    assertNotNull(source);
    assertType(keySelector, Function);

    let args = arguments.length,
        elementSelector = isFunction(elementSelectorOrComparer) ? elementSelectorOrComparer : null,
        resultSelector = isFunction(resultSelectorOrComparer) ? resultSelectorOrComparer : null;

    comparer = args === 3 && elementSelector === null ? elementSelectorOrComparer :
        (args === 4 && resultSelector === null ? resultSelectorOrComparer : comparer);

    return new Iterable(function* () {
        let lookup = new Lookup(source, keySelector, elementSelector);

        for (let element of lookup) {
            yield resultSelector ? resultSelector(element.key, element) : element;
        }
    });
}
