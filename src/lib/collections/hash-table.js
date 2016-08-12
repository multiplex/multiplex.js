import IterableIterator from '../iteration/iterable-iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

export default class HashTable {
    constructor(comparer) {
        this.initialize();
        this.comparer = EqualityComparer.from(comparer);
    }

    initialize() {
        this.size = 0;                      // total number of slots, including release slots (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release slots
        this.buckets = new Array(7);        // bucket list. index: hash, value: slot index;
        this.slots = new Array(7);          // slot list. next: index of the next bucket;
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

    entries() {
        let arr = new Array(this.count()),
            slot = null,
            index = 0;

        for (let i = 0, count = this.size; i < count; i++) {
            slot = this.slots[i];

            if (slot.hash !== undefined) {
                arr[index++] = [slot.key, slot.value];
            }
        }

        return arr;
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


export class HashTableIterator extends IterableIterator {
    // type 0: key, 1: value, -1: [key, value]
    constructor(table, type = -1) {
        super(function* () {
            let index = 0,
                slot = null,
                size = table.size,
                slots = table.slots;

            while (index < size) {
                slot = slots[index++];

                // freed slots have undefined as hashCode value and do not enumerate
                if (slot.hash !== undefined) {
                    yield type === -1 ? [slot.key, slot.value] : (type === 0 ? slot.key : slot.value);
                }
            }
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
