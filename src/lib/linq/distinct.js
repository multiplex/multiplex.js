import Iterable from '../iteration/iterable';
import HashTable from '../collections/hash-table';
import assertNotNull from '../utils/assert-not-null';

export default function distinctIterator(source, comparer = null) {
    assertNotNull(source);

    return new Iterable(function* () {
        let table = new HashTable(comparer);

        for (let element of source) {
            if (table.add(element)) {
                yield element;
            }
        }
    });
}

