import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function forEachIterator(source, action) {
    assertNotNull(source);
    assertType(action, Function);

    let index = 0;

    for (let element of source) {
        action(element, index++);
    }
}
