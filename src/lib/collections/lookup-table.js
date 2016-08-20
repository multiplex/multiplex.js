import Grouping from './grouping';
import Iterator from '../iteration/iterator';
import EqualityComparer from './equality-comparer';
import resize from '../utils/resize';

const emptyGrouping = new Grouping(null, []);

export default class LookupTable {
    constructor(comparer) {
        this.size = 0;
        this.slots = new Array(7);
        this.buckets = new Array(7);
        this.comparer = EqualityComparer.from(comparer);
    }

    add(key, value) {
        this.getGrouping(key, value, true);
    }

    get(key) {
        return this.getGrouping(key, null, false) || emptyGrouping;
    }

    contains(key) {
        return this.getGrouping(key, null, false) !== null;
    }

    entries() {
        let arr = new Array(this.size),
            index = 0;

        for (let i = 0, count = this.slots.length; i < count; i++) {
            arr[index++] = this.slots[i].grouping;
        }

        return arr;
    }

    getGrouping(key, value, create) {
        let comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            index = this.buckets[bucket],
            grouping = null,
            slot = null;


        while (index !== undefined) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.grouping.key, key)) {
                grouping = slot.grouping;
                break;
            }

            index = slot.next;
        }


        if (create === true) {
            if (grouping === null) {
                if (this.size === this.slots.length) {
                    this.resize();
                    bucket = hash % this.buckets.length;
                }

                index = this.size;
                this.size++;

                grouping = new Grouping(key, [value]);
                this.slots[index] = new LookupTableSlot(hash, grouping, this.buckets[bucket]);
                this.buckets[bucket] = index;
            }
            else {
                grouping.elements.push(value);
            }
        }

        return grouping;
    }

    resize() {
        let size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.slots.length = newSize;
        this.buckets.length = newSize;


        // rehash values & update buckets and slots
        for (let index = 0; index < size; index++) {
            slot = this.slots[index];
            bucket = slot.hash % newSize;
            slot.next = this.buckets[bucket];
            this.buckets[bucket] = index;
        }
    }

    static create(source, keySelector, comparer = EqualityComparer.instance) {
        let lookup = new LookupTable(comparer);

        for (let element of source) {
            lookup.add(keySelector(element), element);
        }

        return lookup;
    }

    [Symbol.iterator]() {
        return new LookupTableIterator(this);
    }
}


export class LookupTableIterator extends Iterator {
    constructor(lookup) {
        let index = -1,
            size = lookup.size,
            slots = lookup.slots;

        super(() => {
            if (++index < size) {
                return {
                    value: slots[index++].grouping,
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
}


class LookupTableSlot {
    constructor(hash, grouping, next) {
        this.hash = hash;
        this.next = next;
        this.grouping = grouping;
    }
}
