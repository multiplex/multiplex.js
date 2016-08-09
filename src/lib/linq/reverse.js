import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import buffer from '../utils/buffer';
import asArray from '../utils/as-array';
import assertNotNull from '../utils/assert-not-null';

export default function reverseIterator(source) {
    assertNotNull(source);

    return new Iterable(function () {
        var arr = asArray(source) || buffer(source),
            len = arr.length;

        return new Iterator(function () {
            if (len-- > 0) {
                return {
                    value: arr[len],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
