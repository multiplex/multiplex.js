import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function selectIterator(source, selector) {
    assertNotNull(source);
    assertType(selector, Function);

    return new Iterable(function* () {
        let index = 0;

        for (let element of source) {
            yield selector(element, index++);
        }
    });
}
