import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import isType from '../utils/is-type';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function ofTypeIterator(source, type) {
    assertNotNull(source);
    assertType(type, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                if (isType(next.value, type)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}
