import Iterator from '../iteration/iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';
import forOf from '../utils/for-of';
import extend from '../utils/extend';
import mixin from '../utils/mixin';

export default function HashTable(comparer) {
    this.initialize();
    this.comparer = EqualityComparer.from(comparer);
}


mixin(HashTable.prototype, {
    initialize: function () {
        this.size = 0;                      // total number of slots, including release slots (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release slots
        this.buckets = new Array(7);        // bucket list. index: hash, value: slot index;
        this.slots = new Array(7);          // slot list. next: index of the next bucket;
    },

    add: function (key, value) {
        return this.insert(key, value, true);
    },

    clear: function () {
        this.initialize();
    },

    contains: function (key) {
        return this.find(key) !== -1;
    },

    containsValue: function (value) {
        var slots = this.slots,
            count = this.count(),
            comparer = this.comparer;

        for (var i = 0; i < count; i++) {
            if (slots[i].hash !== undefined && comparer.equals(slots[i].value, value)) {
                return true;
            }
        }

        return false;
    },

    count: function () {
        return this.size - this.freeCount;
    },

    entry: function (key) {
        var index = this.find(key);
        return index === -1 ? undefined : [key, this.slots[index].value];
    },

    find: function (key) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            slot = null;

        for (var index = this.buckets[hash % this.buckets.length]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                return index;
            }

            index = slot.next;
        }

        return -1;
    },

    forEach: function (callback, target, thisArg) {
        forOf(this, function (element) {
            if (thisArg) {
                callback.call(thisArg, element[0], element[1], target);
            }
            else {
                callback(element[0], element[1], target);
            }
        });
    },

    insert: function (key, value, add) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            slot = null,
            index = 0;


        // check for item existance, freed slots have undefined hash-code value and do not need enumeration
        for (index = this.buckets[bucket]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                if (add) {
                    return false;
                }

                slot.value = value;
                return true;
            }

            index = slot.next;
        }



        // item with the same key does not exists, add item

        index = 0;

        // there's already a free index
        if (this.freeCount > 0) {
            index = this.freeIndex;                         // consume free index
            this.freeIndex = this.slots[index].next;      // save new free index
            this.freeCount--;                               // update number of free slots
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

        this.slots[index] = new HashTableSlot(hash, this.buckets[bucket], key, value);
        this.buckets[bucket] = index;

        return true;
    },

    entries: function (keysOnly) {
        var arr = new Array(this.count()),
            slot = null,
            index = 0;

        for (var i = 0; i < this.size; i++) {
            slot = this.slots[i];

            if (slot.hash !== undefined) {
                arr[index++] = keysOnly ? slot.key : [slot.key, slot.value];
            }
        }

        return arr;
    },

    resize: function () {
        var size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.buckets.length = newSize;          // expand buckets
        this.slots.length = newSize;            // expand slots


        // rehash values & update buckets and slots
        for (var index = 0; index < size; index++) {
            slot = this.slots[index];

            // freed slots have undefined hashCode value and do not need rehash
            if (slot.hash !== undefined) {
                bucket = slot.hash % newSize;          // rehash
                slot.next = this.buckets[bucket];      // update slot's next index in the bucket chain
                this.buckets[bucket] = index;           // update bucket index
            }
        }
    },

    remove: function (key) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,     // hash-code of the key
            bucket = hash % this.buckets.length,        // bucket index
            last,
            slot;

        // freed slots have undefined hash-code value and do not need enumeration
        for (var index = this.buckets[bucket]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                // last item in the chained bucket list
                if (last === undefined) {
                    this.buckets[bucket] = slot.next;
                }
                else {
                    this.slots[last].next = slot.next;
                }

                slot.hash = undefined;         // release the slot
                slot.next = this.freeIndex;    // save previous free index
                slot.key = null;
                slot.value = null;

                this.freeIndex = index;         // save new free index
                this.freeCount++;               // update number of free slots
                return true;
            }

            last = index;
            index = slot.next;
        }

        // item does not exist
        return false;
    },

    get: function (key) {
        var index = this.find(key);
        return index === -1 ? undefined : this.slots[index].value;
    },

    set: function (key, value) {
        this.insert(key, value, false);
    },

    '@@iterator': function () {
        return new HashTableIterator(this);
    }
});




export function HashTableIterator(table, selector) {
    var index = 0,
        slot = null,
        size = table.size,
        slots = table.slots;

    Iterator.call(this, function () {
        while (index < size) {
            slot = slots[index++];

            // freed slots have undefined as hashCode value and do not enumerate
            if (slot.hash !== undefined) {
                return {
                    value: selector ? selector(slot.key, slot.value) : [slot.key, slot.value],
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


function HashTableSlot(hash, next, key, value) {
    this.hash = hash;       // item's key hash-code
    this.next = next;       // index of the next bucket in the chained bucket list
    this.key = key;         // item's key
    this.value = value;     // item's value
}

