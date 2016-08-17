import Dictionary from '../collections/dictionary';
import EqualityComparer from '../collections/equality-comparer';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';

export default function toDictionary(source, keySelector, valueSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    if (valueSelector) {
        assertType(valueSelector, Function);
    }

    var dic = new Dictionary(EqualityComparer.from(comparer));

    forOf(source, function (element) {
        dic.add(keySelector(element), valueSelector ? valueSelector(element) : element);
    });

    return dic;
}
