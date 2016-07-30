import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';
import {identityFunction} from './helper-functions';

export default function aggregateIterator(source, seed, func, resultSelector) {
    assertNotNull(source);
    assertType(func, Function);
    resultSelector = resultSelector || identityFunction;
    assertType(resultSelector, Function);

    var result = seed;

    forOf(source, function (element) {
        result = func(result, element);
    });

    return resultSelector(result);
}
