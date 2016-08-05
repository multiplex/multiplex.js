import Collection from './collection';
import HashTableEntry from './hash-table-entry';
import HashTableIterator from './hash-table-iterator';
import EqualityComparer from './equality-comparer';

export default class HashTable extends Collection {
    constructor(capacity = 0, comparer = EqualityComparer.defaultComparer) {
        super();
        this.initialize(capacity);
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize(size) {
        size = getSize(size);
        this.totalCount = 0;                // total number of entries, including release entries (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release entries
        this.buckets = new Array(size);     // bucket list. index: hash, value: entry index;
        this.entries = new Array(size);     // entry list. next: index of the next bucket;
    }

    add(key, value, overwrite) {
        let entries = this.entries,
            buckets = this.buckets,
            hash = this.comparer.hash(key) & 0x7FFFFFFF,
            equals = this.comparer.equals,
            bucket = hash % buckets.length,
            entry = null;


        // check for item existance, freed entries have undefined hash-code value and do not need enumeration
        for (let index = buckets[bucket]; index !== undefined;) {
            entry = entries[index];

            if (entry.hash === hash && equals(entry.key, key)) {
                if (overwrite) {
                    entry.value = value;
                    return true;
                }

                return false;
            }

            index = entry.next;
        }



        // item with the same key does not exists, add item

        let index = 0;

        // there's already a free index
        if (this.freeCount > 0) {
            index = this.freeIndex;                     // consume free index
            this.freeIndex = entries[index].next;       // save new free index
            this.freeCount--;                           // update number of free entries
        }
        else {
            if (this.totalCount === entries.length) {
                bucket = hash % this.resize();         // resize HashTable
            }

            // find a new free index
            index = this.totalCount;
            this.totalCount++;
        }

        entries[index] = new HashTableEntry(hash, buckets[bucket], key, value);
        buckets[bucket] = index;

        return true;
    }

    clear() {
        this.initialize(0);
    }

    contains(key) {
        return this.indexOf(key) !== -1;
    }

    count() {
        return this.totalCount - this.freeCount;
    }

    entries() {
        let arr = new Array(this.count()),
            entries = this.entries,
            entry = null,
            index = 0;

        for (let i = 0, count = this.totalCount; i < count; i++) {
            entry = entries[i];

            if (entry.hash !== undefined) {
                arr[index++] = entry;
            }
        }

        return arr;
    }

    indexOf(key) {
        let hash = this.comparer.hash(key) & 0x7FFFFFFF,
            equals = this.comparer.equals,
            index = this.buckets[hash % this.buckets.length],
            entry = null;

        // freed entries are undefined and do not need enumeration
        while (index !== undefined) {
            entry = this.entries[index];

            if (entry.hash === hash && equals(entry.key, key)) {
                return index;
            }

            index = entry.next;
        }

        // key not found
        return -1;
    }

    resize() {
        let newSize = getSize(this.totalCount),
            entry = null,
            bucket = 0;

        this.buckets.length = newSize;          // expand buckets
        this.entries.length = newSize;          // expand entries


        // rehash values & update buckets and entries
        for (let index = 0; index < this.totalCount; index++) {
            entry = this.entries[index];

            // freed entries have undefined hashCode value and do not need rehash
            if (entry.hash !== undefined) {
                bucket = entry.hash % newSize;          // rehash
                entry.next = this.buckets[bucket];      // update entry's next index in the bucket chain
                this.buckets[bucket] = index;           // update bucket index
            }
        }

        return newSize;
    }

    remove(key) {
        let buckets = this.buckets,
            entries = this.entries,
            equals = this.comparer.equals,
            hash = this.comparer.hash(key) & 0x7FFFFFFF,    // hash-code of the key
            bucket = hash % buckets.length,                 // bucket index
            last,
            entry;

        // freed entries have undefined hash-code value and do not need enumeration
        for (let index = buckets[bucket]; index !== undefined;) {
            entry = entries[index];

            if (entry.hash === hash && equals(entry.key, key)) {
                // last item in the chained bucket list
                if (last === undefined) {
                    buckets[bucket] = entry.next;
                }
                else {
                    entries[last].next = entry.next;
                }

                entry.hash = undefined;         // release the entry
                entry.next = this.freeIndex;    // save previous free index
                entry.key = null;
                entry.value = null;

                this.freeIndex = index;         // save new free index
                this.freeCount++;               // update number of free entries
                return true;
            }

            last = index;
            index = entry.next;
        }

        // item does not exist
        return false;
    }

    get(key) {
        let index = this.indexOf(key);
        return index === -1 ? undefined : this.entries[index].value;
    }

    set(key, value) {
        this.add(key, value, true);
    }

    [Symbol.iterator]() {
        return new HashTableIterator(this);
    }
}


/// Array of primes larger than: 2 ^ (4 x n)
const primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259];

function getSize(size) {
    for (let i = 0, len = primes.length; i < len; i++) {
        if (primes[i] > size) {
            return primes[i];
        }
    }

    return primes[primes.length - 1];
}
