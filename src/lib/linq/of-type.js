import Iterable from '../iteration/iterable';
import isType from '../utils/is-type';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function ofTypeIterator(source, type) {
    assertNotNull(source);
    assertType(type, Function);

    return new Iterable(function* () {
        for (let element of source) {
            if (isType(element, type)) {
                yield element;
            }
        }
    });
}
