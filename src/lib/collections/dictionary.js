import IterableIterator from '../iteration/iterable-iterator';
import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import EqualityComparer from './equality-comparer';
import KeyValuePair from './key-value-pair';
import isType from '../utils/is-type';
import isNumber from '../utils/is-number';
import assertType from '../utils/assert-type';
import error, {ERROR_DUPLICATE_KEY, ERROR_KEY_NOT_FOUND} from '../utils/error';

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

    /**
    * Adds an element with the provided key and value to the Dictionary.
    * @param {Object} key The object to use as the key of the element to add.
    * @param {Object} value The object to use as the value of the element to add.
    */
    add(key, value) {
        if (!this.table.add(key, value)) {
            error(ERROR_DUPLICATE_KEY);
        }
    }

    /**
    * Removes all keys and values from the Dictionary.
    */
    clear() {
        this.table.clear();
    }

    /**
    * Gets the EqualityComparer object that is used to determine equality for the values in the set.
    * @returns {EqualityComparer}
    */
    get comparer () {
        return this.table.comparer;
    }

    /**
    * Gets the number of elements contained in the Dictionary.
    * @returns {Number}
    */
    count() {
        return this.table.count();
    }

    /**
    * Determines whether the Dictionary contains the specified key.
    * @param {Object} key The key to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsKey(key) {
        return this.table.contains(key);
    }

    /**
    * Determines whether the Dictionary contains a specific value.
    * @param {Object} value The value to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsValue(value) {
        return this.table.containsValue(value);
    }

    /**
    * Gets a Collection containing the keys of the Dictionary.
    * @returns {Collection}
    */
    keys() {
        return new KeyValueIterator(this, key => key);
    }

    /**
    * Gets a Collection containing the values in the Dictionary.
    * @returns {Collection}
    */
    values() {
        return new KeyValueIterator(this, (key, value) => value);
    }

    /**
    * Gets element with the specified key.
    * @param {Object} key The key of the element to get.
    * @returns {Object}
    */
    get(key) {
        let entry = this.table.entry(key);
        if (entry !== undefined) {
            return entry[1];
        }

        error(ERROR_KEY_NOT_FOUND);
    }

    /**
    * Sets the element with the specified key.
    * @param {Object} key The key of the element to set.
    * @param {Object} value The object to use as the value of the element to set.
    */
    set(key, value) {
        this.table.set(key, value);
    }

    /**
    * Gets the value associated with the specified key.
    * @param {Object} key The key whose value to get.
    * @param {Function} callback When this method returns, callback method is called with the value
    * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
    * @returns {Boolean}
    */
    tryGetValue(key, callback) {
        assertType(callback, Function);

        let entry = this.table.entry(key);

        if (entry !== undefined) {
            callback(entry[1]);
            return true;
        }

        return false;
    }

    /**
    * Removes the element with the specified key from the Dictionary.
    * @param {Object} key The key of the element to remove.
    * @returns {Boolean}
    */
    remove(key) {
        return this.table.remove(key);
    }

    valueOf() {
        return this.keys();
    }

    get [Symbol.toStringTag]() {
        return 'Dictionary';
    }

    toString() {
        return '[Dictionary]';
    }

    [Symbol.iterator]() {
        return new KeyValueIterator(this, (key, value) => new KeyValuePair(key, value));
    }
}


class KeyValueIterator extends IterableIterator {
    constructor(dic, selector = null) {
        super(() => new HashTableIterator(dic.table, selector));
    }

    get [Symbol.toStringTag]() {
        return 'KeyValue Iterator';
    }

    toString() {
        return '[KeyValue Iterator]';
    }
}
