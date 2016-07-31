import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function lastOrDefaultIterator(source, predicate = () => true, defaultValue = null) {
    assertNotNull(source);
    assertType(predicate, Function);

    let arr = asArray(source),
        result = defaultValue;

    // fast iteration for array-like iterables
    if (arr !== null) {
        let len = arr.length;

        while (len-- > 0) {
            if (predicate(arr[len])) {
                return arr[len];
            }
        }
    }
    else {
        for (let element in source) {
            if (predicate(element)) {
                result = element;
            }
        }
    }


    return result;
}
