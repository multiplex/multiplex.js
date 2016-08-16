import IterableIterator from '../iteration/iterable-iterator';
import Collection from './collection';
import HashTable from './hash-table';
import EqualityComparer from './equality-comparer';
import KeyValuePair from './key-value-pair';
import isType from '../utils/is-type';
import isNumber from '../utils/is-number';

/**
* Initializes a new instance of the Dictionary.
* @param {Dictionary|EqualityComparer|Number} value The Dictionary whose elements are copied to the new Dictionary or the EqualityComparer or Capacity
* @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
*/
export default class Dictionary extends Collection {
    constructor(value, comparer = EqualityComparer.instance) {
        let dic = isType(value, Dictionary) ? value : null,
            cmp = EqualityComparer.from(dic ? comparer : value),
            table = new HashTable(cmp, dic ? dic.count() : (isNumber(value) ? value : 0));

        if (dic) {
            for (let element of dic) {
                table.add(element.key, element.value);
            }
        }

        super();
        this.table = table;
    }

    get [Symbol.toStringTag]() {
        return 'Dictionary';
    }

    toString() {
        return '[Dictionary]';
    }

    [Symbol.iterator]() {
        return new DictionaryIterator(this);
    }
}


class DictionaryIterator extends IterableIterator {
    constructor(dic) {
        super(function* () {
            for (let element in dic.table) {
                yield new KeyValuePair(element[0], element[1]);
            }
        });
    }

    get [Symbol.toStringTag]() {
        return 'Dictionary Iterator';
    }

    toString() {
        return '[Dictionary Iterator]';
    }
}
