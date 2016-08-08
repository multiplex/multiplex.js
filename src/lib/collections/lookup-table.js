import Grouping from './grouping';
import Iterator from '../iteration/iterator';
import EqualityComparer from './equality-comparer';
import iteratorSymbol from '../iteration/iterator-symbol';
import resize from '../utils/resize';
import forOf from '../utils/for-of';
import mixin from '../utils/mixin';

var emptyGrouping = new Grouping(null, []);

export default function LookupTable(comparer) {
    this.size = 0;
    this.slots = new Array(7);
    this.buckets = new Array(7);
    this.comparer = EqualityComparer.from(comparer);
}


mixin(LookupTable.prototype, {
    add: function (key, value) {
        this.getGrouping(key, value, true);
    },

    get: function (key) {
        return this.getGrouping(key, null, false) || emptyGrouping;
    },

    contains: function (key) {
        return this.getGrouping(key, null, false) !== null;
    },

    getGrouping: function (key, value, create) {
        var hash = this.comparer.hash(key) & 0x7FFFFFFF,
            equals = this.comparer.equals,
            bucket = hash % this.buckets.length,
            index = this.buckets[bucket],
            grouping = null,
            slot = null;


        while (index !== undefined) {
            slot = this.slots[index];

            if (slot.hash === hash && equals(slot.grouping.key, key)) {
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
                this.slots[index] = new Slot(hash, grouping, this.buckets[bucket]);
                this.buckets[bucket] = index;
            }
            else {
                grouping.elements.push(value);
            }
        }

        return grouping;
    },

    resize: function () {
        var size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.slots.length = newSize;
        this.buckets.length = newSize;


        // rehash values & update buckets and slots
        for (var index = 0; index < size; index++) {
            slot = this.slots[index];
            bucket = slot.hash % newSize;
            slot.next = this.buckets[bucket];
            this.buckets[bucket] = index;
        }
    },

    keys: function () {
        var arr = new Array(this.size),
            index = 0;

        for (var i = 0, count = this.slots.length; i < count; i++) {
            arr[index++] = this.slots[i].grouping.key;
        }

        return arr;
    }
});


mixin(LookupTable, {
    create: function (source, keySelector, comparer) {
        var lookup = new LookupTable(comparer);

        forOf(source, function (element) {
            lookup.add(keySelector(element), element);
        });

        return lookup;
    }
});


LookupTable.prototype[iteratorSymbol] = function () {
    var slots = this.slots,
        length = slots.length,
        index = 0;

    return new Iterator(function () {
        if (++index < length) {
            return {
                value: slots[index],
                done: false
            };
        }

        return {
            done: true
        };
    });
};


function Slot(hash, grouping, next) {
    this.hash = hash;
    this.next = next;
    this.grouping = grouping;
}
