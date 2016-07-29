import isArrayLike from './is-array-like';
import iterator from '../iteration/iterator-factory';
import ArrayIterable from '../iteration/iterable-array';


export default function forOf(source, action) {
    var arr = asArray(source);

    // fast array iteration
    if (arr) {
        var len = arr.length,
            i = 0;

        for (; i < len;) {
            if (action(arr[i++]) !== undefined) {
                break;
            }
        }
    }

    else {
        var it = iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (action(next.value) !== undefined) {
                break;
            }
        }
    }
}


function asArray(value) {
    if (isArrayLike(value)) {                       // array-likes have fixed element count
        return value;
    }

    else if (value instanceof ArrayIterable) {      // ArrayIterable wrapper
        return value.valueOf();
    }

    return null;
}
