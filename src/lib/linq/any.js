import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';
import {trueFunction} from './helper-functions';

export default function anyIterator(source, predicate) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var result = false;

    forOf(source, function (element) {
        if (predicate(element)) {
            return result = true;
        }
    });

    return result;
}
