import Collection from './collection';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

export default class Set extends Collection {
    constructor(comparer = EqualityComparer.defaultComparer) {
        super();
        this.totalCount = 0;
        this.slots = new Array(7);
        this.buckets = new Array(7);
        this.comparer = EqualityComparer.from(comparer);
    }

    add(value) {
        return !this.find(value, true);
    }

    contains(value) {
        return this.find(value, false);
    }

    count() {
        return this.totalCount;
    }

    find(value, add) {
        let hash = this.comparer.hash(value) & 0x7FFFFFFF,
            equals = this.comparer.equals,
            bucket = hash % this.buckets.length,
            index = this.buckets[bucket],
            slot = null;


        while (index !== undefined) {
            slot = this.slots[index];

            if (slot.hash === hash && equals(slot.value, value)) {
                return true;
            }

            index = slot.next;
        }


        if (add) {
            if (this.totalCount === this.slots.length) {
                this.resize();
                bucket = hash % this.buckets.length;
            }

            index = this.totalCount;
            this.totalCount++;

            this.slots[index] = new Slot(hash, value, this.buckets[bucket]);
            this.buckets[bucket] = index;
        }

        return false;
    }

    resize() {
        let count = this.totalCount,
            newSize = resize(count),
            slot = null,
            bucket = 0;

        this.slots.length = newSize;
        this.buckets.length = newSize;


        // rehash values & update buckets and slots
        for (let index = 0; index < count; index++) {
            slot = this.slots[index];
            bucket = slot.hash % newSize;
            slot.next = this.buckets[bucket];
            this.buckets[bucket] = index;
        }
    }

    valueOf() {
        var arr = new Array(this.totalCount),
            slot = null,
            index = 0;

        for (let i = 0, count = this.slots.length; i < count; i++) {
            slot = this.slots[i];

            if (slot.hash !== undefined) {
                arr[index++] = slot.value;
            }
        }

        return arr;
    }
}


class Slot {
    constructor(hash, value, next) {
        this.hash = hash;
        this.next = next;
        this.value = value;
    }
}
