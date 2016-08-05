import Iterator from '../iteration/iterator';

export default class HashTableIterator extends Iterator {
    constructor(table) {
        let index = 0,
            entry = null,
            count = table.totalCount,
            entries = table.entries;

        super(() => {
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
}
