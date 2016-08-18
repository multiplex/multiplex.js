import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';
import forOf from '../utils/for-of';
import extend from '../utils/extend';

export default function Set(iterable, comparer) {
    var table = new HashTable(comparer);

    if (iterable !== null) {
        forOf(iterable, function (element) {
            table.add(element, element);
        });
    }

    this.table = table;
    this.size = this.table.count();
}

extend(Set, Collection, {
    add: function (value) {
        this.table.add(value, value);
        this.size = this.table.count();
        return this;
    },

    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    copyTo: function (array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    },

    count: function () {
        return this.size;
    },

    delete: function (value) {
        var result = this.table.remove(value);
        this.size = this.table.count();
        return result ? value : false;
    },

    entries: function () {
        return new SetIterator(this, -1);
    },

    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    has: function (value) {
        return this.table.contains(value);
    },

    keys: function () {
        return new SetIterator(this, function (key) {
            return key;
        });
    },

    values: function () {
        return new SetIterator(this, function (key, value) {
            return value;
        });
    },

    valueOf: function () {
        return this.table.entries();
    },

    toString: function () {
        return '[Set]';
    },

    '@@iterator': function () {
        return this.keys();
    }
});



function SetIterator(set, selector) {
    HashTableIterator.call(this, set, selector);
}

extend(SetIterator, HashTableIterator, {
    toString: function () {
        return '[Set Iterator]';
    }
});
