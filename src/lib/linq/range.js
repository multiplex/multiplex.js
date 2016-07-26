import assertType from '../utils/assert-type';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';
import Iterable from '../iteration/iterable';

export default function rangeIterator(start, count) {
    assertType(start, Number);
    assertType(count, Number);

    let max = start + count - 1;

    if (count < 0 || max > Number.MAX_VALUE) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function* () {
        let index = -1;

        if (++index < count) {
            yield start + index;
        }
    });
}
