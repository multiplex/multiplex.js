import assertType from '../utils/assert-type';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';
import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';

export default function rangeIterator(start, count) {
    assertType(start, Number);
    assertType(count, Number);

    var max = start + count - 1;

    if (count < 0 || max > Number.MAX_VALUE) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function () {
        var index = -1;

        return new Iterator(function () {
            if (++index < count) {
                return {
                    value: start + index,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
