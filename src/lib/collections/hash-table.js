import Collection from './collection';
import HashTableIterator from './hash-table-iterator';
import EqualityComparer from './equality-comparer';
import iteratorSymbol from '../iteration/iterator-symbol';
import resize from '../utils/resize';
import mixin from '../utils/mixin';
import extend from '../utils/extend';


export default function HashTable(capacity, comparer) {
    Collection.call(this);
    this.initialize(capacity || 0);
    this.comparer = EqualityComparer.from(comparer);
}

extend(HashTable, Collection);


mixin(HashTable.prototype, {
    initialize: function (size) {
        size = resize(size);
        this.totalCount = 0;                // total number of entries, including release entries (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release entries
        this.buckets = new Array(size);     // bucket list. index: hash, value: entry index;
        this.entries = new Array(size);     // entry list. next: index of the next bucket;
    },

    add: function (key, value, overwrite) {
        var hash = this.comparer.hash(key) & 0x7FFFFFFF,       // hash code of the key
            equals = this.comparer.equals,
            bucket = hash % this.buckets.length,              // bucket index
            entry = null,
            index = 0;


        // check for item existance, freed entries have undefined hash-code value and do not need enumeration
        for (var index = this.buckets[bucket]; index !== undefined;) {
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

        index = 0;

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
    },

    clear: function () {
        this.initialize(0);
    },

    contains: function (key) {
        return this.indexOf(key) !== -1;
    },

    count: function () {
        return this.totalCount - this.freeCount;
    },

    keys: function () {
        var arr = new Array(this.count()),
            entries = this.entries,
            entry = null,
            index = 0;

        for (var i = 0, count = this.totalCount; i < count; i++) {
            entry = entries[i];

            if (entry.hash !== undefined) {
                arr[index++] = entry.key;
            }
        }

        return arr;
    },

    indexOf: function (key) {
        var hash = this.comparer.hash(key) & 0x7FFFFFFF,
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
    },

    resize: function () {
        var newSize = resize(this.totalCount),
            entry = null,
            bucket = 0;

        this.buckets.length = newSize;          // expand buckets
        this.entries.length = newSize;          // expand entries


        // rehash values & update buckets and entries
        for (var index = 0; index < this.totalCount; index++) {
            entry = this.entries[index];

            // freed entries have undefined hashCode value and do not need rehash
            if (entry.hash !== undefined) {
                bucket = entry.hash % newSize;          // rehash
                entry.next = this.buckets[bucket];      // update entry's next index in the bucket chain
                this.buckets[bucket] = index;           // update bucket index
            }
        }
    },

    remove: function (key) {
        var equals = this.comparer.equals,
            hash = this.comparer.hash(key) & 0x7FFFFFFF,    // hash-code of the key
            bucket = hash % this.buckets.length,                 // bucket index
            last,
            entry;

        // freed entries have undefined hash-code value and do not need enumeration
        for (var index = this.buckets[bucket]; index !== undefined;) {
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
    },

    get: function (key) {
        var index = this.indexOf(key);
        return index === -1 ? undefined : this.entries[index].value;
    },

    set: function (key, value) {
        this.add(key, value, true);
    },

    valueOf: function () {
        this.keys();
    }
});


HashTable.prototype[iteratorSymbol] = function () {
    return new HashTableIterator(this);
};


function Entry(hash, next, key, value) {
    this.hash = hash;       // item's key hash-code
    this.next = next;       // index of the next bucket in the chained bucket list
    this.key = key;         // item's key
    this.value = value;     // item's value
}

