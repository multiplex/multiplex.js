import asArray from './as-array';
import $iterator from '../iteration/iterator-factory';

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
        var it = $iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (action(next.value) !== undefined) {
                break;
            }
        }
    }
}

