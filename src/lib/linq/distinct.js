import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import Set from '../collections/set';
import assertNotNull from '../utils/assert-not-null';

export default function distinctIterator(source, comparer) {
    assertNotNull(source);

    return new Iterable(function () {
        var it = iterator(source),
            set = new Set(comparer),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                if (set.add(next.value)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}
