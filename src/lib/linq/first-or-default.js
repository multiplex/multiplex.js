import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function firstOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || (() => true);
    assertType(predicate, Function);

    let arr = asArray(source);

    if (arr !== null) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (predicate(arr[i])) {
                return arr[i];
            }
        }
    }
    else {
        for (let element of source) {
            if (predicate(element)) {
                return element;
            }
        }
    }

    return defaultValue;
}
