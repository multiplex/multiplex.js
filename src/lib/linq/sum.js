import select from './select';
import forOf from '../utils/for-of';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_NON_NUMERIC_TYPE} from '../utils/error';

export default function sumIterator(source, selector) {
    assertNotNull(source);

    if (selector) {
        assertType(selector, Function);
        return sumIterator(select(source, selector));
    }

    var arr = asArray(source),
        sum = 0;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
            sum += arr[i];
        }
    }
    else {
        forOf(source, function (element) {
            sum += element;
        });
    }

    if (isNaN(sum)) {
        error(ERROR_NON_NUMERIC_TYPE);
    }

    return sum;
}
