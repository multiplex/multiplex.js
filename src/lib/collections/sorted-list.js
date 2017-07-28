import Iterator from '../iteration/iterator';
import Collection from './collection';
import Dcitionary from './dictionary';
import Comparer from './comparer';
import KeyValuePair from './key-value-pair';
import isType from '../utils/is-type';
import isNumber from '../utils/is-number';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import binarySearch from '../utils/binary-search';
import buffer from '../utils/buffer';
import count from '../utils/count';
import extend from '../utils/extend';
import error, {
    ERROR_DUPLICATE_KEY,
    ERROR_KEY_NOT_FOUND,
    ERROR_ARGUMENT_OUT_OF_RANGE
} from '../utils/error';

/**
 * Initializes a new instance of the SortedList class.
 * @param {Dictionary|Comparer|Number=} value The Dictionary whose elements are copied to the new SortedList, he Comparer implementation to use when comparing keys or The initial number of elements that the SortedList can contain.
 * @param {Comparer=} comparer The Comparer implementation to use when comparing keys.
 */
export default function SortedList(value, comparer) {
    var dic = isType(value, Dcitionary) ? value : null,
        capacity = isNumber(value, Number) ? value : (dic ? dic.count() : 0);

    comparer = Comparer.from(comparer || value);
    this.slot = new SortedListSlot(capacity, dic ? dic.count() : 0, comparer);

    if (dic) {
        var arr = buffer(dic).sort(function (x, y) {
            return comparer.compare(x.key, y.key);
        });

        while (capacity-- > 0) {
            this.slot.keys[capacity] = arr[capacity].key;
            this.slot.values[capacity] = arr[capacity].value;
        }
    }
}


extend(SortedList, Collection, {
    /**
     * Adds an element with the specified key and value into the SortedList.
     * @param {Object} key The key of the element to add.
     * @param {Object} value The value of the element to add.
     */
    add: function (key, value) {
        assertNotNull(key);

        var index = binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);

        if (index >= 0) {
            error(ERROR_DUPLICATE_KEY);
        }

        this.insert(~index, key, value);
    },

    /**
     * Gets or sets the number of elements that the SortedList can contain.
     * @param {Number} value The number of elements that the SortedList can contain.
     * @returns {Number}
     */
    capacity: function (value) {
        if (value === null || value === undefined) {
            return this.slot.keys.length;
        } else {
            assertType(value, Number);

            if (value !== this.slot.keys.length) {
                if (value < this.slot.size) {
                    error(ERROR_ARGUMENT_OUT_OF_RANGE);
                }

                this.slot.keys.length = value;
                this.slot.values.length = value;
            }
        }
    },


    /**
     * Removes all elements from the SortedList.
     */
    clear: function () {
        this.slot.keys.length = 0;
        this.slot.values.length = 0;
    },


    /**
     * Gets the Comparer for the sorted list.
     * @returns {Comparer}
     */
    comparer: function () {
        return this.slot.comparer;
    },


    /**
     * Determines whether the SortedList contains a specific key.
     * @param {Object} key The key to locate in the SortedList.
     * @returns {Boolean}
     */
    containsKey: function (key) {
        return this.indexOfKey(key) >= 0;
    },


    /**
     * Determines whether the SortedList contains a specific value.
     * @param {Object} value The value to locate in the SortedList.
     * @returns {Boolean}
     */
    containsValue: function (value) {
        return this.indexOfValue(value) >= 0;
    },

    /**
     * Gets the number of key/value pairs contained in the SortedList.
     * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
     * @returns {Number}
     */
    count: function (predicate) {
        return predicate ? count(this, predicate) : this.slot.size;
    },


    /**
     * Gets the value associated with the specified key.
     * @param {Object} key The key whose value to get.
     * @returns {Object}
     */
    get: function (key) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            return this.slot.values[index];
        }

        error(ERROR_KEY_NOT_FOUND);
    },


    /**
     * Gets a collection containing the keys in the SortedList, in sorted order.
     * @returns {Collection}
     */
    keys: function () {
        return this.slot.keys;
    },

    /**
     * Gets a collection containing the values in the SortedLis.
     * @returns {Collection}
     */
    values: function () {
        return this.slot.values;
    },


    /**
     * Searches for the specified key and returns the zero-based index within the entire SortedList.
     * @param {Object} key The key to locate in the SortedList.
     * @returns {Number}
     */
    indexOfKey: function (key) {
        assertNotNull(key);
        return binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);
    },

    /**
     * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
     * @param {Object} value The value to locate in the SortedList.
     * @returns {Number}
     */
    indexOfValue: function (value) {
        return this.slot.values.indexOf(value);
    },

    /**
     * Removes the element with the specified key from the SortedList.
     * Returns true if the element is successfully removed; otherwise, false.This method also returns false if key was not found in the original SortedList.
     * @param { Object } key The key of the element to remove.
     * @returns { Boolean }
     */
    remove: function (key) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            this.removeAt(index);
            return true;
        }

        return false;
    },

    /**
     * Removes the element at the specified index of the SortedList.
     * @param {Number} index The zero-based index of the element to remove.
     */
    removeAt: function (index) {
        assertType(index, Number);

        if (index < 0 || index >= this.slot.size) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        this.slot.size--;
        this.slot.keys.splice(index, 1);
        this.slot.values.splice(index, 1);
        this.slot.keys.length++;
        this.slot.values.length++;
    },

    /**
     * Sets the value associated with the specified key.
     * @param {Object} key The key whose value to get or set.
     * @param {Object} value The value associated with the specified key.
     */
    set: function (key, value) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            this.slot.values[index] = value;
            return;
        }

        this.insert(~index, key, value);
    },

    /**
     * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
     */
    trimExcess: function () {
        var threshold = this.slot.keys.length * 0.9;

        if (this.slot.size < threshold) {
            this.capacity(this.slot.size);
        }
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

        var index = this.indexOfKey(key);

        if (index >= 0) {
            callback(this.slot.values[index]);
            return true;
        }

        return false;
    },


    insert: function (index, key, value) {
        var slot = this.slot;

        if (slot.size === slot.keys.length) {
            var newCapacity = slot.keys.length === 0 ? 4 : slot.keys.length * 2,
                max = Number.MAX_VALUE,
                min = slot.size + 1;

            if (newCapacity > max) {
                newCapacity = max;
            }

            if (newCapacity < min) {
                newCapacity = min;
            }

            this.capacity(newCapacity);
        }

        if (index < slot.size) {
            slot.keys.splice(index, 0, key);
            slot.values.splice(index, 0, value);
        }

        slot.size++;
        slot.keys[index] = key;
        slot.values[index] = value;
    },

    toString: function () {
        return '[SortedList]';
    },

    '@@iterator': function () {
        var keys = this.slot.keys,
            values = this.slot.values,
            size = this.slot.size,
            index = -1;

        return new Iterator(function () {
            while (++index < size) {
                return {
                    value: new KeyValuePair(keys[index], values[index]),
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
});



function SortedListSlot(capacity, size, comparer) {
    this.size = size;
    this.comparer = comparer;
    this.keys = new Array(capacity);
    this.values = new Array(capacity);
}
