import Iterable from '../iteration/iterable';
import iterator from '../iteration/iterator-factory';
import assertNotNull from '../utils/assert-not-null';

export default function defaultIfEmptyIterator(source, defaultValue) {
    assertNotNull(source);

    return new Iterable(function* () {
        let it = iterator(source),
            next = it.next();

        if (!next.done) {
            do {
                yield next.value;
            }
            while (!(next = it.next()).done);
        }
        else {
            yield defaultValue;
        }
    });
}
