import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import HashTable from '../collections/hash-table';
import forOf from '../utils/for-of';
import assertNotNull from '../utils/assert-not-null';

export default function exceptIntersectIterator(first, second, comparer, intersect) {
    assertNotNull(first);
    assertNotNull(second);

    var result = intersect ? true : false;

    return new Iterable(function () {
        var it = iterator(first),
            table = new HashTable(comparer),
            next;

        return new Iterator(function () {
            forOf(second, function (element) {
                table.add(element);
            });

            if (!(next = it.next()).done) {
                if (table.contains(next.value) === result) {
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
