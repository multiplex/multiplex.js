import Iterable from '../iteration/iterable';
import buffer from '../utils/buffer';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function takeIterator(source, count) {
    assertNotNull(source);
    assertType(count, Number);

    let arr = asArray(source);

    if (arr !== null) {
        return new Iterable(buffer(arr).slice(0, count));
    }

    return new Iterable(function* () {
        if (count > 0) {
            for (let element of source) {
                yield element;
                if (--count === 0) {
                    break;
                }
            }
        }
    });
}
