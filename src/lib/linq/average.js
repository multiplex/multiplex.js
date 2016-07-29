import select from './select';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_NO_ELEMENTS, ERROR_NON_NUMERIC_TYPE} from '../utils/error';

export default function averageIterator(source, selector = null) {
    assertNotNull(source);

    if (selector != null) {
        assertType(selector, Function);
        return averageIterator(select(source, selector));
    }

    let sum = 0,
        count = 0;

    for (let element of source) {
        sum += element;
        count++;
    }

    if (count === 0) {
        error(ERROR_NO_ELEMENTS);
    }

    if (isNaN(sum)) {
        error(ERROR_NON_NUMERIC_TYPE);
    }

    return sum / count;
}
