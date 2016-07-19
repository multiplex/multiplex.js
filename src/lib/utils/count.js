import Iterable from '../iteration/iterable';
import Collection from '../collections/collection';
import isArrayLike from './is-array-like';

// Gets number of items if the value is a Collection, Array or an Array-like, otherwise returns -1.
export default function count(value) {
    if (isArrayLike(value)) {
        return value.length;
    }

    else if (value instanceof Collection) {
        return value.count();
    }

    else if (value instanceof Iterable) {
        if (isArrayLike(value.valueOf())) {
            return value.valueOf().length;
        }
    }

    return -1;
}
