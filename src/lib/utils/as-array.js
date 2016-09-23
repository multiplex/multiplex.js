import isArrayLike from './is-array-like';
import ArrayIterable from '../iteration/iterable-array';

export default function asArray(value) {
    if (isArrayLike(value)) {                       // array-likes have fixed element count
        return value;
    }

    else if (value instanceof ArrayIterable) {      // ArrayIterable wrapper
        return value.toArray();
    }

    return null;
}
