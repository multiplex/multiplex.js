import Iterator from '../iteration/iterator';
import Collection from './collection';
import KeyValuePair from './key-value-pair';
import EqualityComparer from './equality-comparer';


/// Array of primes larger than: 2 ^ (4 x n)
const primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259];

export default class HashTable extends Collection {
    constructor(capacity = 0, comparer = EqualityComparer.defaultComparer) {
        super();
        this.initialize(capacity);
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize(size) {
        size = getPrime(size);
        this.totalCount = 0;                // total number of entries, including release entries (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release entries
        this.buckets = new Array(size);     // bucket list. index: hash, value: entry index;
        this.entries = new Array(size);     // entry list. next: index of the next bucket;
    }

    add(key, value, overwrite) {
        let entries = this.entries,
            buckets = this.buckets,
            hash = this.comparer.hash(key) & 0x7FFFFFFF,       // hash code of the key
            equals = this.comparer.equals,
            bucket = hash % buckets.length,              // bucket index
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

        entries[index] = new Entry(hash, buckets[bucket], key, value);
        buckets[bucket] = index;

        return true;
    }

    clear() {
        this.initialize(0);
    }

    contains(key) {
        return this.findEntry(key) !== -1;
    }

    count() {
        return this.totalCount - this.freeCount;
    }

    get(key) {
        let index = this.findEntry(key);
        return index === -1 ? undefined : this.entries[index].value;
    }

    set(key, value) {
        this.add(key, value, true);
    }

    findEntry(key) {
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
        let newSize = getPrime(this.totalCount),
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

    keys() {
        if (this._keys === undefined) {
            let arr = new Array(this.count()),
                entry = null,
                index = 0;

            for (var i = 0; i < this.totalCount; i++) {
                entry = this.entries[i];

                if (entry.hash !== undefined) {
                    arr[index++] = entry.key;
                }
            }

            this._keys = new Collection(arr);
        }

        return this._keys;
    }

    values() {
        if (this._values === undefined) {
            let arr = new Array(this.count()),
                entry = null,
                index = 0;

            for (let i = 0; i < this.totalCount; i++) {
                entry = this.entries[i];

                if (entry.hash !== undefined) {
                    arr[index++] = entry.value;
                }
            }

            this._values = new Collection(arr);
        }

        return this._values;
    }

    [Symbol.iterator]() {
        let index = 0,
            entry = null,
            count = this.totalCount,
            entries = this.entries;

        return new Iterator(function () {
            while (index < count) {
                entry = entries[index++];

                // freed entries have undefined as hashCode value and do not enumerate
                if (entry.hash !== undefined) {
                    return {
                        value: new KeyValuePair(entry.key, entry.value),
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

class Entry {
    constructor(hash, next, key, value = null) {
        this.hash = hash;       // item's key hash-code
        this.next = next;       // index of the next bucket in the chained bucket list
        this.key = key;         // item's key
        this.value = value;     // item's value
    }
}


function getPrime(min) {
    for (let i = 0, len = primes.length; i < len; i++) {
        if (primes[i] > min) {
            return primes[i];
        }
    }

    return primes[primes.length - 1];
}
