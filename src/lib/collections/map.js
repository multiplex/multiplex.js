import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import iteratorSymbol from '../iteration/iterator-symbol';
import isArray from '../utils/is-array';
import error from '../utils/error';
import forOf from '../utils/for-of';
import extend from '../utils/extend';
import mixin from '../utils/mixin';

export default function Map(iterable) {
    var table = new HashTable();

    if (iterable !== null) {
        forOf(iterable, function (element) {
            if (isArray(element)) {
                table.add(element[0], element[1]);
            }
            else {
                error('Iterator value ' + element + ' is not an entry object');
            }
        });
    }

    this.table = table;
    this.size = this.table.count();
}

extend(Map, Collection);

mixin(Map.prototype, {
    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    delete: function (key) {
        var value = this.table.get(key),
            result = this.table.remove(key);

        this.size = this.table.count();
        return result ? value : false;
    },

    entries: function () {
        return new MapIterator(this, -1);
    },

    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    get: function (key) {
        return this.table.get(key);
    },

    has: function (value) {
        return this.table.contains(value);
    },

    keys: function () {
        return new MapIterator(this, 0);
    },

    set: function (key, value) {
        this.table.set(key, value);
        this.size = this.table.count();
        return this;
    },

    values: function () {
        return new MapIterator(this, 1);
    },

    valueOf: function () {
        return this.table.keys();
    },

    toString: function () {
        return '[Map]';
    }
});

extend(Map, Collection);

Map.prototype[iteratorSymbol] = function () {
    return new MapIterator(this, 0);
};



// type 0: key, 1: value, -1: [key, value]
function MapIterator(map, type) {
    HashTableIterator.call(this, map, type);
}

extend(MapIterator, HashTableIterator);

mixin(MapIterator.prototype, {
    toString: function () {
        return '[Map Iterator]';
    }
});
