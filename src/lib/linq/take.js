import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import buffer from '../utils/buffer';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function takeIterator(source, count) {
    assertNotNull(source);
    assertType(count, Number);

    var arr = asArray(source);

    if (arr !== null) {
        return new Iterable(buffer(arr).slice(0, count));
    }

    return new Iterable(function () {
        var it = iterator(source),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done && count-- > 0) {
                return {
                    value: next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
