import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import $iterator from '../iteration/iterator-factory';

export default function selectManyIterator(source, collectionSelector, resultSelector) {
    assertNotNull(source);
    assertType(collectionSelector, Function);
    if (resultSelector) {
        assertType(resultSelector, Function);
    }

    return new Iterable(function () {
        var it = $iterator(source),
            next = it.next(),
            itcol,
            nextcol,
            index = 0;

        return new Iterator(function () {
            if (!next.done) {
                do {
                    itcol = itcol || $iterator(collectionSelector(next.value, index++));

                    while (!(nextcol = itcol.next()).done) {
                        return {
                            value: resultSelector ? resultSelector(next.value, nextcol.value) : nextcol.value,
                            done: false
                        };
                    }

                    itcol = null;
                }
                while (!(next = it.next()).done);
            }

            return {
                done: true
            };
        });
    });
}

