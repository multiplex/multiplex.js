import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';

export default class Set extends Collection {
    constructor(iterable = null, comparer = null) {
        super();
        this.table = new HashTable(comparer);

        if (iterable !== null) {
            for (let element of iterable) {
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

    copyTo(array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    }

    count() {
        return this.size;
    }

    delete(value) {
        let result = this.table.remove(value);
        return result ? value : false;
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
        return new SetIterator(this, key => key);
    }

    values() {
        return new SetIterator(this, (key, value) => value);
    }

    valueOf() {
        return this.table.entries();
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
        return this.keys();
    }
}


class SetIterator extends HashTableIterator {
    constructor(set, selector = null) {
        super(set.table, selector);
    }

    get [Symbol.toStringTag]() {
        return 'Set Iterator';
    }

    toString() {
        return '[Set Iterator]';
    }
}
