import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {trueFunction} from './helper-functions';

export default function anyIterator(source, predicate) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var it = iterator(source),
        next;

    while (!(next = it.next()).done) {
        if (predicate(next.value)) {
            return true;
        }
    }

    return false;
}
