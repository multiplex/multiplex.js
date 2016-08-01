import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function selectManyIterator(source, collectionSelector, resultSelector = null) {
    assertNotNull(source);
    assertType(collectionSelector, Function);
    if (resultSelector) {
        assertType(resultSelector, Function);
    }

    return new Iterable(function* () {
        let index = 0;
        for (let element in source) {
            for (let subElement in collectionSelector(element, index++)) {
                yield resultSelector ? resultSelector(element, subElement) : subElement;
            }
        }
    });
}
