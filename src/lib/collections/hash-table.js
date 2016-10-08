import Iterator from '../iteration/iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

export default class HashTable {
    constructor(comparer, capacity = 0) {
        this.initialize(capacity);
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize(capacity) {
        this.size = 0;                              // total number of slots, including release slots (freeCount)
        this.freeIndex = undefined;                 // next free index in the bucket list
        this.freeCount = 0;                         // total number of release slots
        this.buckets = new Array(capacity || 7);    // bucket list. index: hash, value: slot index;
        this.slots = new Array(capacity || 7);      // slot list. next: index of the next bucket;
    }

    add(key, value = null) {
        return this.insert(key, value, true);
    }

    clear() {
        this.initialize(0);
    }

    contains(key) {
        return this.find(key) !== -1;
    }

    containsValue(value) {
        let slots = this.slots,
            count = this.count(),
            comparer = this.comparer;

        for (let i = 0; i < count; i++) {
            if (slots[i].hash !== undefined && comparer.equals(slots[i].value, value)) {
                return true;
            }
        }

        return false;
    }

    count() {
        return this.size - this.freeCount;
    }

    entry(key) {
        let index = this.find(key);
        return index === -1 ? undefined : [key, this.slots[index].value];
    }

    find(key) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            slot = null;

        for (let index = this.buckets[hash % this.buckets.length]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                return index;
            }

            index = slot.next;
        }

        return -1;
    }

    forEach(callback, target, thisArg = null) {
        if (thisArg !== null) {
            callback = callback.bind(thisArg);
        }

        for (let element of this) {
            callback(element[0], element[1], target);
        }
    }

    insert(key, value, add) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            slot = null;


        // check for item existance, freed slots have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
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

        let index = 0;

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
    }

    entries(keysOnly = false) {
        let arr = new Array(this.count()),
            slot = null,
            index = 0;

        for (let i = 0; i < this.size; i++) {
            slot = this.slots[i];

            if (slot.hash !== undefined) {
                arr[index++] = keysOnly ? slot.key : [slot.key, slot.value];
            }
        }

        return arr;
    }

    resize() {
        let size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.buckets.length = newSize;          // expand buckets
        this.slots.length = newSize;            // expand slots


        // rehash values & update buckets and slots
        for (let index = 0; index < size; index++) {
            slot = this.slots[index];

            // freed slots have undefined hashCode value and do not need rehash
            if (slot.hash !== undefined) {
                bucket = slot.hash % newSize;           // rehash
                slot.next = this.buckets[bucket];       // update slot's next index in the bucket chain
                this.buckets[bucket] = index;           // update bucket index
            }
        }
    }

    remove(key) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,     // hash-code of the key
            bucket = hash % this.buckets.length,        // bucket index
            last,
            slot;

        // freed slots have undefined hash-code value and do not need enumeration
        for (let index = this.buckets[bucket]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                // last item in the chained bucket list
                if (last === undefined) {
                    this.buckets[bucket] = slot.next;
                }
                else {
                    this.slots[last].next = slot.next;
                }

                slot.hash = undefined;          // release the slot
                slot.next = this.freeIndex;     // save previous free index
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
    }

    get(key) {
        let index = this.find(key);
        return index === -1 ? undefined : this.slots[index].value;
    }

    set(key, value) {
        this.insert(key, value, false);
    }

    [Symbol.iterator]() {
        return new HashTableIterator(this);
    }
}


export class HashTableIterator extends Iterator {
    constructor(table, selector = null) {
        let index = 0,
            slot = null,
            size = table.size,
            slots = table.slots;

        super(function () {
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
}


class HashTableSlot {
    constructor(hash, next, key, value = null) {
        this.hash = hash;       // item's key hash-code
        this.next = next;       // index of the next bucket in the chained bucket list
        this.key = key;         // item's key
        this.value = value;     // item's value
    }
}
