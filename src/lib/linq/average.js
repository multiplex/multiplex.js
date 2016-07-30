import select from './select';
import forOf from '../utils/for-of';
import assertNotNull from '../utils/assert-not-null';
import error, {ERROR_NO_ELEMENTS, ERROR_NON_NUMERIC_TYPE} from '../utils/error';

export default function averageIterator(source, selector) {
    assertNotNull(source);

    if (selector) {
        return averageIterator(select(source, selector));
    }

    var sum = 0,
        count = 0;

    forOf(source, function (element) {
        sum += element;
        count++;
    });

    if (count === 0) {
        error(ERROR_NO_ELEMENTS);
    }

    if (isNaN(sum)) {
        error(ERROR_NON_NUMERIC_TYPE);
    }

    return sum / count;
}
