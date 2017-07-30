import Iterator from './iterator';

/**
* Supports an iteration over a .Net Enumerable.
* @param {Object} obj An Enumerable instance.
*/
export default class EnumerableIterator extends Iterator {
    constructor(enumerable) {
        let enumerator = enumerable.getEnumerator();

        super(() => {
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

    get [Symbol.toStringTag]() {
        return 'Enumerable Iterator';
    }

    toString() {
        return '[Enumerable Iterator]';
    }
}
