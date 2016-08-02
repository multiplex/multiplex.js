import Iterable from '../iteration/iterable';
import buffer from '../utils/buffer';
import asArray from '../utils/as-array';
import assertNotNull from '../utils/assert-not-null';

export default function reverseIterable(source) {
    assertNotNull(source);

    return new Iterable(function* () {
        let arr = asArray(source) || buffer(source),
            len = arr.length;

        while (len-- > 0) {
            yield arr[len];
        }
    });
}
