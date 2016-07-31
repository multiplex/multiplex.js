import lastOrDefault from './last-or-default';
import error, {ERROR_NO_ELEMENTS, ERROR_NO_MATCH} from '../utils/error';

export default function lastIterator(source, predicate) {
    var value = {},
        result = lastOrDefault(source, predicate, value);

    if (result === value) {
        error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
    }

    return result;
}
