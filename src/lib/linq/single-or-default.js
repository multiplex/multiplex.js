import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_MORE_THAN_ONE_ELEMENT} from '../utils/error';

export default function singleOrDefaultIterator(source, predicate = null, defaultValue = null) {
    assertNotNull(source);
    predicate = predicate || (() => true);
    assertType(predicate, Function);

    let arr = asArray(source),
        result = defaultValue,
        count = 0;

    if (arr !== null) {
        for (let i = 0, len = arr.length; i < len && count <= 1; i++) {
            if (predicate(arr[i])) {
                result = arr[i];
                count++;
            }
        }
    }
    else {
        for (let element of source) {
            if (predicate(element) && count <= 1) {
                result = element;
                count++;
            }
        }
    }

    if (count < 2) {
        return result;
    }

    error(ERROR_MORE_THAN_ONE_ELEMENT);
}
