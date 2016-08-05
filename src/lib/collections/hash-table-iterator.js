import Iterator from '../iteration/iterator';
import extend from '../utils/extend';

export default function HashTableIterator(table) {
    var index = 0,
        entry = null,
        count = table.totalCount,
        entries = table.entries;

    Iterator.call(this, function () {
        while (index < count) {
            entry = entries[index++];

            // freed entries have undefined as hashCode value and do not enumerate
            if (entry.hash !== undefined) {
                return {
                    value: [entry.key, entry.value],
                    done: false
                };
            }
        }

        return {
            done: true
        };
    });
}

extend(HashTableIterator, Iterator);
