import assertType from '../utils/assert-type';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';
import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';

export default function repeatIterator(element, count) {
    assertType(count, Number);

    if (count < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function () {
        var index = count;

        return new Iterator(function () {
            if (index-- > 0) {
                return {
                    value: element,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
