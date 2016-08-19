import Collection from './collection';
import LookupTable, {LookupTableIterator} from './lookup-table';
import EqualityComparer from './equality-comparer';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default class Lookup extends Collection {
    constructor(source, keySelector, elementSelector = null, comparer = EqualityComparer.instance) {
        assertNotNull(source);
        assertType(keySelector, Function);

        if (elementSelector) {
            assertType(elementSelector, Function);
        }

        super();
        this.table = new LookupTable(comparer);

        for (let element of source) {
            this.table.add(keySelector(element), elementSelector ? elementSelector(element) : element);
        }
    }

    get(key) {
        return this.table.get(key);
    }

    contains(key) {
        return this.table.contains(key);
    }

    count() {
        return this.table.size;
    }

    valueOf() {
        this.table.entries();
    }

    [Symbol.iterator]() {
        return new LookupTableIterator(this.table);
    }

    get [Symbol.toStringTag]() {
        return 'Lookup';
    }

    toString() {
        return '[Lookup]';
    }
}
