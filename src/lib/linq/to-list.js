import assertNotNull from '../utils/assert-not-null';
import List from '../collections/list';

export default function toList(source) {
    assertNotNull(source);
    return new List(source);
}
