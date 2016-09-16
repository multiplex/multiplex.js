import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';
import isArrayLike from './is-array-like';
import $iterator from '../iteration/iterator-factory';

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

    else {
        var it = $iterator(value),
            count = 0;

        while (!it.next().done) {
            count++;
        }

        return count;
    }
}
