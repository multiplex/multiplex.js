import Iterable from '../iteration/iterable';
import iterator from '../iteration/iterator-factory';
import buffer from '../utils/buffer';
import asArray from '../utils/as-array';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function skipIterator(source, count) {
    assertNotNull(source);
    assertType(count, Number);

    let arr = asArray(source);

    if (arr !== null) {
        return new Iterable(buffer(arr).slice(count));
    }

    return new Iterable(function* () {
        let it = iterator(source),
            next;

        while (count > 0 && !it.next().done) {
            count--;
        }

        if (count <= 0) {
            while (!(next = it.next()).done) {
                yield next.value;
            }
        }
    });
}
