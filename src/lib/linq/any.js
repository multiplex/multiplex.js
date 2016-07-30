import forOf from '../utils/for-of';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {trueFunction} from './helper-functions';

export default function anyIterator(source, predicate) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var result = false;

    forOf(source, function (element) {
        if (predicate(element)) {
            result = true;
            return result;
        }
    });

    return result;
}
