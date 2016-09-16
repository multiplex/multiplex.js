import Collection from './collection';
import HashTable from './hash-table';
import EqulityComparer from './equality-comparer';
import iterable from '../iteration/iterable-factory';

export default class HashSet extends Collection {
    constructor(source = null, comparer = EqulityComparer.instance) {
        super();
        this.table = new HashTable(EqulityComparer.from(comparer));

        if (source) {
            for (let element of iterable(source)) {
                this.table.add(element);
            }
        }
    }

    get [Symbol.toStringTag]() {
        return 'HashSet';
    }

    toString() {
        return '[HashSet]';
    }
}
