import forOf from '../utils/for-of';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {trueFunction} from './helper-functions';

export default function firstOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue;

    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (predicate(arr[i])) {
                return arr[i];
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                result = element;
                return true;
            }
        });
    }

    return result;
}
