import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';
import isArray from '../utils/is-array';
import error from '../utils/error';

export default class Map extends Collection {
    constructor(iterable = null, comparer = null) {
        super();
        this.table = new HashTable(comparer);

        if (iterable !== null) {
            for (let element of iterable) {
                if (isArray(element)) {
                    this.table.add(element[0], element[1]);
                }
                else {
                    error('Iterator value ' + element + ' is not an entry object');
                }
            }
        }
    }

    clear() {
        this.table.clear();
    }

    copyTo(array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    }

    count() {
        return this.size;
    }

    delete(key) {
        let value = this.table.get(key),
            result = this.table.remove(key);

        return result ? value : false;
    }

    entries() {
        return new MapIterator(this, -1);
    }

    forEach(callback, thisArg = null) {
        this.table.forEach(callback, this, thisArg);
    }

    get(key) {
        return this.table.get(key);
    }

    has(value) {
        return this.table.contains(value);
    }

    keys() {
        return new MapIterator(this, 0);
    }

    set(key, value) {
        this.table.set(key, value);
        return this;
    }

    values() {
        return new MapIterator(this, 1);
    }

    valueOf() {
        return this.table.entries();
    }

    get size() {
        return this.table.count();
    }

    get [Symbol.toStringTag]() {
        return 'Map';
    }

    toString() {
        return '[Map]';
    }

    [Symbol.iterator]() {
        return new MapIterator(this, -1);
    }
}


class MapIterator extends HashTableIterator {
    // type 0: key, 1: value, -1: [key, value]
    constructor(map, type = 0) {
        super(map.table, type);
    }

    get [Symbol.toStringTag]() {
        return 'Map Iterator';
    }

    toString() {
        return '[Map Iterator]';
    }
}
