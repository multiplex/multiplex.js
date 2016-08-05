import Iterable from '../iteration/iterable';
import HashTable from '../collections/hash-table';
import assertNotNull from '../utils/assert-not-null';

export default function unionIterator(first, second, comparer = null) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function* () {
        let table = new HashTable(0, comparer);

        for (let element of first) {
            if (table.add(element)) {
                yield element;
            }
        }

        for (let element of second) {
            if (table.add(element)) {
                yield element;
            }
        }
    });
}
