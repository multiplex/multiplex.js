import Collection from './collection';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';
import mixin from '../utils/mixin';
import extend from '../utils/extend';


export default function Set(capacity, comparer) {
    Collection.call(this);
    this.totalCount = 0;
    this.slots = new Array(7);
    this.buckets = new Array(7);
    this.comparer = EqualityComparer.from(comparer);
}

extend(Set, Collection);


mixin(Set.prototype, {
    add: function (value) {
        return !this.find(value, true);
    },

    contains: function (value) {
        return this.find(value, false);
    },

    count: function () {
        return this.totalCount;
    },

    find: function (value, add) {
        var hash = this.comparer.hash(value) & 0x7FFFFFFF,
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
    },

    resize: function () {
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
    },

    valueOf: function () {
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
});


function Slot(hash, value, next) {
    this.hash = hash;
    this.next = next;
    this.value = value;
}

