import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import Set from '../collections/set';
import forOf from '../utils/for-of';
import assertNotNull from '../utils/assert-not-null';

export default function exceptIntersectIterator(first, second, intersect, comparer) {
    assertNotNull(first);
    assertNotNull(second);

    var result = intersect ? true : false;

    return new Iterable(function () {
        var it = iterator(first),
            set = new Set(comparer),
            next;

        return new Iterator(function () {
            forOf(second, function (element) {
                set.add(element);
            });

            if (!(next = it.next()).done) {
                if (set.contains(next.value) === result) {
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
