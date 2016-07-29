import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import asArray from '../utils/as-array';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';

export default function elementAtIterator(source, index) {
    assertNotNull(source);
    assertType(index, Number);

    if (index < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    let arr = asArray(source);

    // fast find for array-like objects
    if (arr !== null) {
        if (index < arr.length) {
            return arr[index];
        }
    }

    else {
        let it = iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (index-- === 0) {
                return next.value;
            }
        }
    }

    error(ERROR_ARGUMENT_OUT_OF_RANGE);
}
