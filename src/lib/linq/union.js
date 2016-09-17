import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import HashTable from '../collections/hash-table';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function unionIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var table = new HashTable(comparer),
            it1 = $iterator(first),
            it2 = $iterator(second),
            next;

        return new Iterator(function () {
            while (!(next = it1.next()).done || !(next = it2.next()).done) {
                if (table.add(next.value)) {
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
