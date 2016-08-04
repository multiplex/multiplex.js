import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import HashTable from '../collections/hash-table';
import assertNotNull from '../utils/assert-not-null';

export default function distinctIterator(source, comparer) {
    assertNotNull(source);

    return new Iterable(function () {
        var it = iterator(source),
            table = new HashTable(0, comparer),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
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
