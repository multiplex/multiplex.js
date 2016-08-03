import forOf from '../utils/for-of';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {trueFunction} from './helper-functions';
import error, {ERROR_MORE_THAN_ONE_ELEMENT} from '../utils/error';

export default function singleOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue,
        count = 0;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len && count <= 1; i++) {
            if (predicate(arr[i])) {
                result = arr[i];
                count++;
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                if (count > 1) {
                    return false;
                }

                result = element;
                count++;
            }
        });
    }

    if (count < 2) {
        return result;
    }

    error(ERROR_MORE_THAN_ONE_ELEMENT);
}
