import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';

export default class Set extends Collection {
    constructor(iterable = null) {
        this.table = new HashTable();

        if (iterable !== null) {
            for (let element in iterable) {
                this.table.add(element, element);
            }
        }
    }

    add(value) {
        this.table.add(value, value);
        return this;
    }

    clear() {
        this.table.clear();
    }

    entries() {
        return new SetIterator(this, -1);
    }

    forEach(callback, thisArg = null) {
        this.table.forEach(callback, this, thisArg);
    }

    has(value) {
        return this.table.contains(value);
    }

    keys() {
        return new SetIterator(this, 0);
    }

    values() {
        return new SetIterator(this, 1);
    }

    valueOf() {
        return this.table.keys();
    }

    get size() {
        return this.table.count();
    }

    get [Symbol.toStringTag]() {
        return 'Set';
    }

    toString() {
        return '[Set]';
    }

    [Symbol.iterator]() {
        return new SetIterator(this, 0);
    }
}


class SetIterator extends HashTableIterator {
    // type 0: key, 1: value, -1: [key, value]
    constructor(set, type = 0) {
        super(set.table, type);
    }

    get [Symbol.toStringTag]() {
        return 'Set Iterator';
    }

    toString() {
        return '[Set Iterator]';
    }
}
