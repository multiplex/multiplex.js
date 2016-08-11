import where from './where';
import count from '../utils/count';
import assertNotNull from '../utils/assert-not-null';

export default function countIterator(source, predicate) {
    assertNotNull(source);

    if (predicate) {
        return count(where(source, predicate));
    }

    return count(source);
}
