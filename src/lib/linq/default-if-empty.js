import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import iterator from '../iteration/iterator-factory';
import assertNotNull from '../utils/assert-not-null';

export default function defaultIfEmptyIterator(source, defaultValue) {
    assertNotNull(source);

    return new Iterable(function () {
        var it = iterator(source),
            next = it.next(),
            empty = next.done;

        return new Iterator(function () {
            if (!next.done) {
                var result = {
                    value: next.value,
                    done: false
                };

                next = it.next();
                return result;
            }
            else if (empty) {
                empty = false;
                return {
                    value: defaultValue,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}
