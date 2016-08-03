import select from './select';
import asArray from '../utils/as-array';
import compare from '../runtime/compare';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_NO_ELEMENTS} from '../utils/error';

export default function minMaxIterable(source, max, selector = null) {
    assertNotNull(source);

    if (selector) {
        assertType(selector, Function);
        return minMaxIterable(select(source, selector), max);
    }

    let arr = asArray(source),
        result = max ? 1 : -1,
        hasValue = false,
        value;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (hasValue) {
                if (compare(arr[i], value) === result) {
                    value = arr[i];
                }
            }
            else {
                value = arr[i];
                hasValue = true;
            }
        }
    }
    else {
        for (let element of source) {
            if (hasValue) {
                if (compare(element, value) === result) {
                    value = element;
                }
            }
            else {
                value = element;
                hasValue = true;
            }
        }
    }

    if (!hasValue) {
        error(ERROR_NO_ELEMENTS);
    }

    return value;
}
