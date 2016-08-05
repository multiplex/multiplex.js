import Collection from './collection';
import HashTableIterator from './hash-table-iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

export default class HashTable extends Collection {
    constructor(capacity = 0, comparer = EqualityComparer.defaultComparer) {
        super();
        this.initialize(capacity);
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize(size) {
        size = resize(size);
        this.totalCount = 0;                // total number of entries, including release entries (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release entries
        this.buckets = new Array(size);     // bucket list. index: hash, value: entry index;
        this.entries = new Array(size);     // entry list. next: index of the next bucket;
    }

    add(key, value, overwrite) {
        let hash = this.comparer.hash(key) & 0x7FFFFFFF,
            equals = this.comparer.equals,
            bucket = hash % this.buckets.length,
            entry = null;


        // check for item existance, freed entries have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
            entry = this.entries[index];

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
            index = this.freeIndex;                         // consume free index
            this.freeIndex = this.entries[index].next;      // save new free index
            this.freeCount--;                               // update number of free entries
        }
        else {
            if (this.totalCount === this.buckets.length) {
                this.resize();
                bucket = hash % this.buckets.length;
            }

            // find a new free index
            index = this.totalCount;
            this.totalCount++;
        }

        this.entries[index] = new Entry(hash, this.buckets[bucket], key, value);
        this.buckets[bucket] = index;

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

    keys() {
        let arr = new Array(this.count()),
            entry = null,
            index = 0;

        for (let i = 0, count = this.totalCount; i < count; i++) {
            entry = this.entries[i];

            if (entry.hash !== undefined) {
                arr[index++] = entry.key;
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
        let newSize = resize(this.totalCount),
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
    }

    remove(key) {
        let equals = this.comparer.equals,
            hash = this.comparer.hash(key) & 0x7FFFFFFF,    // hash-code of the key
            bucket = hash % this.buckets.length,            // bucket index
            last,
            entry;

        // freed entries have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
            entry = this.entries[index];

            if (entry.hash === hash && equals(entry.key, key)) {
                // last item in the chained bucket list
                if (last === undefined) {
                    this.buckets[bucket] = entry.next;
                }
                else {
                    this.entries[last].next = entry.next;
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

    valueOf() {
        this.keys();
    }

    [Symbol.iterator]() {
        return new HashTableIterator(this);
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
