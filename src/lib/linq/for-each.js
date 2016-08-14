import forOf from '../utils/for-of';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function forEachIterator(source, action, thisArg) {
    assertNotNull(source);
    assertType(action, Function);

    var index = 0;

    forOf(source, function (element) {
        if (thisArg) {
            action.call(thisArg, element, index++);
        }
        else {
            action(element, index++);
        }
    });
}
