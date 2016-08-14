import select from './select';
import forOf from '../utils/for-of';
import asArray from '../utils/as-array';
import compare from '../runtime/compare';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_NO_ELEMENTS} from '../utils/error';

export default function minMaxIterator(source, max, selector) {
    assertNotNull(source);

    if (selector) {
        assertType(selector, Function);
        return minMaxIterator(select(source, selector), max);
    }

    var arr = asArray(source),
        result = max ? 1 : -1,
        hasValue = false,
        value;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
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
        forOf(source, function (element) {
            if (hasValue) {
                if (compare(element, value) === result) {
                    value = element;
                }
            }
            else {
                value = element;
                hasValue = true;
            }
        });
    }

    if (!hasValue) {
        error(ERROR_NO_ELEMENTS);
    }

    return value;
}
