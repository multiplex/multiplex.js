import singleOrDefault from './first-or-default';
import error, {ERROR_NO_ELEMENTS, ERROR_NO_MATCH} from '../utils/error';

export default function singleIterator(source, predicate) {
    var value = {},
        result = singleOrDefault(source, predicate, value);

    if (result === value) {
        error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
    }

    return result;
}
