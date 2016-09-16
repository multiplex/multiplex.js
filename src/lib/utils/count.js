import Collection from '../collections/collection';
import ArrayIterable from '../iteration/iterable-array';
import isArrayLike from './is-array-like';
import $iterable from '../iteration/iterable-factory';

/*jshint unused:false*/
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
        let count = 0;

        for (let element of $iterable(value)) {
            count++;
        }

        return count;
    }
}
