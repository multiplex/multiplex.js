import forOf from '../utils/for-of';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {trueFunction} from './helper-functions';

export default function lastOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue;

    // fast iteration for array-like iterables
    if (arr !== null) {
        var len = arr.length;

        while (len-- > 0) {
            if (predicate(arr[len])) {
                return arr[len];
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                result = element;
            }
        });
    }

    return result;
}
