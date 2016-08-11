import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function aggregateIterator(source, seed, func, resultSelector) {
    assertNotNull(source);
    assertType(func, Function);
    assertType(resultSelector, Function);

    let result = seed;

    for (let element of source) {
        result = func(result, element);
    }

    return resultSelector(result);
}
