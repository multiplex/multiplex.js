import isArrayLike from './is-array-like';
import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';

// Gets number of items if the value is a Collection, Array or an Array-like, otherwise returns -1.
export default function count(value) {
    if (isArrayLike(value)) {
        return value.length;
    }

    else if (value instanceof ArrayIterable) {
        return value.valueOf().length;
    }

    else if (value instanceof Collection) {
        return value.count();
    }

    return -1;
}
