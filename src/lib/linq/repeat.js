import assertType from '../utils/assert-type';
import error, {ERROR_ARGUMENT_OUT_OF_RANGE} from '../utils/error';
import Iterable from '../iteration/iterable';

export default function repeatIterator(element, count) {
    assertType(count, Number);

    if (count < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function* () {
        let index = count;

        while (index-- > 0) {
            yield element;
        }
    });
}
