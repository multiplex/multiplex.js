import iterator from '../iteration/iterator-factory';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import {identityFunction} from './helper-functions';

export default function aggregateIterator(source, seed, func, resultSelector) {
    assertNotNull(source);
    assertType(func, Function);
    resultSelector = resultSelector || identityFunction;
    assertType(resultSelector, Function);

    var result = seed,
        it = iterator(source),
        next;

    while (!(next = it.next()).done) {
        result = func(result, next.value);
    }

    return resultSelector(result);
}
