import Iterable from '../iteration/iterable';
import assertType from '../utils/assert-type';

export default function selectIterator(source, selector) {
    assertType(selector, Function);

    return new Iterable(function* () {
        let index = 0;

        for (let element of source) {
            yield selector(element, index++);
        }
    });
}
