import IterableIterator from '../iteration/iterable-iterator';
import Collection from './collection';
import HashTable, { HashTableIterator } from './hash-table';
import EqualityComparer from './equality-comparer';
import KeyValuePair from './key-value-pair';

import isType from '../utils/is-type';
import isNumber from '../utils/is-number';
import assertType from '../utils/assert-type';
import forOf from '../utils/for-of';
import defineProperty from '../utils/define-property';
import extend from '../utils/extend';
import count from '../utils/count';
import error, { ERROR_DUPLICATE_KEY, ERROR_KEY_NOT_FOUND } from '../utils/error';

/**
* Initializes a new instance of the Dictionary.
* @param {Dictionary|EqualityComparer|Number} value The Dictionary whose elements are copied to the new Dictionary or the EqualityComparer or Capacity
* @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
*/
export default function Dictionary(value, comparer) {
    var dic = isType(value, Dictionary) ? value : null,
        cmp = EqualityComparer.from(dic ? comparer : value),
        table = new HashTable(cmp, dic ? dic.count() : (isNumber(value) ? value : 0));

    if (dic) {
        forOf(dic, function (element) {
            table.add(element.key, element.value);
        });
    }

    this.table = table;

    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(Dictionary, Collection, {
    /**
    * Adds an element with the provided key and value to the Dictionary.
    * @param {Object} key The object to use as the key of the element to add.
    * @param {Object} value The object to use as the value of the element to add.
    */
    add: function (key, value) {
        if (!this.table.add(key, value)) {
            error(ERROR_DUPLICATE_KEY);
        }
    },

    /**
    * Removes all keys and values from the Dictionary.
    */
    clear: function () {
        this.table.clear();
    },

    /**
    * Gets the number of elements contained in the Dictionary.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? count(this, predicate) : this.table.count();
    },

    /**
    * Determines whether the Dictionary contains the specified key.
    * @param {Object} key The key to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsKey: function (key) {
        return this.table.contains(key);
    },

    /**
    * Determines whether the Dictionary contains a specific value.
    * @param {Object} value The value to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsValue: function (value) {
        return this.table.containsValue(value);
    },

    /**
    * Gets a Collection containing the keys of the Dictionary.
    * @returns {Collection}
    */
    keys: function () {
        return new KeyValueIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Gets a Collection containing the values in the Dictionary.
    * @returns {Collection}
    */
    values: function () {
        return new KeyValueIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Gets element with the specified key.
    * @param {Object} key The key of the element to get.
    * @returns {Object}
    */
    get: function (key) {
        var entry = this.table.entry(key);
        if (entry !== undefined) {
            return entry[1];
        }

        error(ERROR_KEY_NOT_FOUND);
    },

    /**
    * Sets the element with the specified key.
    * @param {Object} key The key of the element to set.
    * @param {Object} value The object to use as the value of the element to set.
    */
    set: function (key, value) {
        this.table.set(key, value);
    },

    /**
    * Gets the value associated with the specified key.
    * @param {Object} key The key whose value to get.
    * @param {Function} callback When this method returns, callback method is called with the value
    * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
    * @returns {Boolean}
    */
    tryGetValue: function (key, callback) {
        assertType(callback, Function);

        var entry = this.table.entry(key);

        if (entry !== undefined) {
            callback(entry[1]);
            return true;
        }

        return false;
    },

    /**
    * Removes the element with the specified key from the Dictionary.
    * @param {Object} key The key of the element to remove.
    * @returns {Boolean}
    */
    remove: function (key) {
        return this.table.remove(key);
    },

    toString: function () {
        return '[Dictionary]';
    },

    '@@iterator': function () {
        return new KeyValueIterator(this, function (key, value) {
            return new KeyValuePair(key, value);
        });
    }
});



function KeyValueIterator(dic, selector) {
    IterableIterator.call(this, function () {
        return new HashTableIterator(dic.table, selector);
    });
}

extend(KeyValueIterator, IterableIterator, {
    toString: function () {
        return '[KeyValue Iterator]';
    }
});
