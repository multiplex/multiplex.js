import Dictionary from '../collections/dictionary';
import EqualityComparer from '../collections/equality-comparer';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default function toDictionary(source, keySelector, valueSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    if (valueSelector) {
        assertType(valueSelector, Function);
    }

    let dic = new Dictionary(EqualityComparer.from(comparer));

    for (let element in source) {
        dic.add(keySelector(element), valueSelector ? valueSelector(element) : element);
    }

    return dic;
}
