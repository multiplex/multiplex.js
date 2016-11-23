import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import asArray from '../utils/as-array';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';
import $iterator from '../iteration/iterator-factory';

export default function elementAtIterator(source, index) {
    assertNotNull(source);
    assertType(index, Number);

    if (index < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    var arr = asArray(source);

    // fast find for array-like objects
    if (arr !== null) {
        if (index < arr.length) {
            return arr[index];
        }
    }

    else {
        var it = $iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (index-- === 0) {
                return next.value;
            }
        }
    }

    error(ERROR_ARGUMENT_OUT_OF_RANGE);
}