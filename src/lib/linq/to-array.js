import buffer from '../utils/buffer';
import assertNotNull from '../utils/assert-not-null';

export default function toArray(source) {
    assertNotNull(source);
    return buffer(source);
}
