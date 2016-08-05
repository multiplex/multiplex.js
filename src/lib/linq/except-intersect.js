import Iterable from '../iteration/iterable';
import Set from '../collections/set';
import assertNotNull from '../utils/assert-not-null';

export default function exceptIntersectIterator(first, second, intersect = true, comparer = null) {
    assertNotNull(first);
    assertNotNull(second);

    let result = intersect ? true : false;

    return new Iterable(function* () {
        let set = new Set(comparer);

        for (let element in second) {
            set.add(element);
        }

        for (let element in first) {
            if (set.contains(element) === result) {
                yield element;
            }
        }
    });
}

