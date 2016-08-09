import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import Lookup from '../collections/lookup';
import isFunction from '../utils/is-function';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function groupIterator(source, keySelector, elementSelectorOrComparer, resultSelectorOrComparer, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    let args = arguments.length,
        elementSelector = isFunction(elementSelectorOrComparer) ? elementSelectorOrComparer : null,
        resultSelector = isFunction(resultSelectorOrComparer) ? resultSelectorOrComparer : null;

    comparer = args === 3 && elementSelector === null ? elementSelectorOrComparer :
        (args === 4 && resultSelector === null ? resultSelectorOrComparer : comparer);

    return new Iterable(function () {
        var lookup = new Lookup(source, keySelector, elementSelector),
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
