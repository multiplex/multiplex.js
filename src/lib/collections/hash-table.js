import IterableIterator from '../iteration/iterable-iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

export default class HashTable {
    constructor(comparer = EqualityComparer.defaultComparer) {
        this.initialize();
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize() {
        this.size = 0;                      // total number of entries, including release entries (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release entries
        this.buckets = new Array(7);        // bucket list. index: hash, value: entry index;
        this.entries = new Array(7);        // entry list. next: index of the next bucket;
    }

    add(key, value = null) {
        return this.insert(key, value, true);
    }

    clear() {
        this.initialize();
    }

    contains(key) {
        return this.find(key) !== -1;
    }

    count() {
        return this.size - this.freeCount;
    }

    find(key) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            entry = null;

        for (let index = this.buckets[hash % this.buckets.length]; index !== undefined;) {
            entry = this.entries[index];

            if (entry.hash === hash && comparer.equals(entry.key, key)) {
                return index;
            }

            index = entry.next;
        }

        return -1;
    }

    forEach(callback, target, thisArg = null) {
        for (let element of this) {
            if (thisArg) {
                callback.call(thisArg, element[0], element[1], target);
            }
            else {
                callback(element[0], element[1], target);
            }
        }
    }

    insert(key, value, add) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            entry = null;


        // check for item existance, freed entries have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
            entry = this.entries[index];

            if (entry.hash === hash && comparer.equals(entry.key, key)) {
                if (add) {
                    return false;
                }

                entry.value = value;
                return true;
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
            if (this.size === this.buckets.length) {
                this.resize();
                bucket = hash % this.buckets.length;
            }

            // find a new free index
            index = this.size;
            this.size++;
        }

        this.entries[index] = new Entry(hash, this.buckets[bucket], key, value);
        this.buckets[bucket] = index;

        return true;
    }

    keys() {
        let arr = new Array(this.count()),
            entry = null,
            index = 0;

        for (let i = 0, count = this.size; i < count; i++) {
            entry = this.entries[i];

            if (entry.hash !== undefined) {
                arr[index++] = entry.key;
            }
        }

        return arr;
    }

    resize() {
        let size = this.size,
            newSize = resize(size),
            entry = null,
            bucket = 0;

        this.buckets.length = newSize;          // expand buckets
        this.entries.length = newSize;          // expand entries


        // rehash values & update buckets and entries
        for (let index = 0; index < size; index++) {
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
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,     // hash-code of the key
            bucket = hash % this.buckets.length,        // bucket index
            last,
            entry;

        // freed entries have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
            entry = this.entries[index];

            if (entry.hash === hash && comparer.equals(entry.key, key)) {
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
        let index = this.find(key);
        return index === -1 ? undefined : this.entries[index].value;
    }

    set(key, value) {
        this.insert(key, value, false);
    }

    [Symbol.iterator]() {
        return new HashTableIterator(this);
    }
}


export class HashTableIterator extends IterableIterator {
    // type 0: key, 1: value, -1: [key, value]
    constructor(table, type = -1) {
        super(function* () {
            let index = 0,
                entry = null,
                size = table.size,
                entries = table.entries;

            while (index < size) {
                entry = entries[index++];

                // freed entries have undefined as hashCode value and do not enumerate
                if (entry.hash !== undefined) {
                    yield type === -1 ? [entry.key, entry.value] : (type === 1 ? entry.key : entry.value);
                }
            }
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
