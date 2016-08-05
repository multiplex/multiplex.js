import Iterable from '../iteration/iterable';
import HashTable from '../collections/hash-table';
import assertNotNull from '../utils/assert-not-null';

export default function exceptIntersectIterator(first, second, intersect = true, comparer = null) {
    assertNotNull(first);
    assertNotNull(second);

    let result = intersect ? true : false;

    return new Iterable(function* () {
        let table = new HashTable(0, comparer);

        for (let element in second) {
            table.add(element);
        }

        for (let element in first) {
            if (table.contains(element) === result) {
                yield element;
            }
        }
    });
}

