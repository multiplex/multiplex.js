import Iterator from './iterator';
import extend from '../utils/extend';

/**
* Supports an iteration over an .Net Enumerable.
* @param {Object} obj An Enumerable instance.
*/
export default function EnumerableIterator(enumerable) {
    var enumerator = enumerable.getEnumerator();

    Iterator.call(this, function () {
        if (enumerator.next()) {
            return {
                value: enumerator.current,
                done: false
            };
        }

        return {
            done: true
        };
    });
}


extend(EnumerableIterator, Iterator, {
    toString: function () {
        return '[Enumerable Iterator]';
    }
});
