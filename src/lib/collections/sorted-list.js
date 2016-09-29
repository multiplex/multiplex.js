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
export default class SortedList extends Collection {
    constructor(value, comparer = null) {
        super();

        let dic = isType(value, Dcitionary) ? value : null,
            capacity = isNumber(value, Number) ? value : (dic ? dic.count() : 0);

        comparer = Comparer.from(comparer || value);
        this.slot = new SortedListSlot(capacity, dic ? dic.count() : 0, comparer);

        if (dic) {
            let arr = buffer(dic).sort((x, y) => comparer.compare(x.key, y.key));

            while (capacity-- > 0) {
                this.slot.keys[capacity] = arr[capacity].key;
                this.slot.values[capacity] = arr[capacity].value;
            }
        }
    }

    /**
    * Adds an element with the specified key and value into the SortedList.
    * @param {Object} key The key of the element to add.
    * @param {Object} value The value of the element to add.
    */
    add(key, value) {
        assertNotNull(key);

        let index = binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);

        if (index >= 0) {
            error(ERROR_DUPLICATE_KEY);
        }

        this.insert(~index, key, value);
    }

    /**
    * Gets or sets the number of elements that the SortedList can contain.
    * @param {Number} value The number of elements that the SortedList can contain.
    * @returns {Number}
    */
    capacity(value) {
        if (value === null || value === undefined) {
            return this.slot.keys.length;
        }
        else {
            assertType(value, Number);

            if (value !== this.slot.keys.length) {
                if (value < this.slot.size) {
                    error(ERROR_ARGUMENT_OUT_OF_RANGE);
                }

                this.slot.keys.length = value;
                this.slot.values.length = value;
            }
        }
    }


    /**
    * Removes all elements from the SortedList.
    */
    clear() {
        this.slot = new SortedListSlot(0, 0, this.slot.compare);
    }

    /**
    * Gets the Comparer for the sorted list.
    * @returns {Comparer}
    */
    comparer() {
        return this.slot.comparer;
    }


    /**
    * Determines whether the SortedList contains a specific key.
    * @param {Object} key The key to locate in the SortedList.
    * @returns {Boolean}
    */
    containsKey(key) {
        return this.indexOfKey(key) >= 0;
    }


    /**
    * Determines whether the SortedList contains a specific value.
    * @param {Object} value The value to locate in the SortedList.
    * @returns {Boolean}
    */
    containsValue(value) {
        return this.indexOfValue(value) >= 0;
    }

    /**
    * Gets the number of key/value pairs contained in the SortedList.
    * @returns {Number}
    */
    count() {
        return this.slot.size;
    }

    /**
    * Gets the value associated with the specified key.
    * @param {Object} key The key whose value to get.
    * @returns {Object}
    */
    get(key) {
        let index = this.indexOfKey(key);

        if (index >= 0) {
            return this.slot.values[index];
        }

        error(ERROR_KEY_NOT_FOUND);
    }


    /**
    * Gets a collection containing the keys in the SortedList, in sorted order.
    * @returns {Collection}
    */
    keys() {
        return this.slot.keys;
    }

    /**
    * Gets a collection containing the values in the SortedLis.
    * @returns {Collection}
    */
    values() {
        return this.slot.values;
    }

    /**
    * Searches for the specified key and returns the zero-based index within the entire SortedList.
    * @param {Object} key The key to locate in the SortedList.
    * @returns {Number}
    */
    indexOfKey(key) {
        assertNotNull(key);
        return binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);
    }

    /**
    * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
    * @param {Object} value The value to locate in the SortedList.
    * @returns {Number}
    */
    indexOfValue(value) {
        return this.slot.values.indexOf(value);
    }

    /**
    * Removes the element with the specified key from the SortedList.
    * Returns true if the element is successfully removed; otherwise, false.This method also returns false if key was not found in the original SortedList.
    * @param { Object } key The key of the element to remove.
    * @returns { Boolean }
    */
    remove(key) {
        let index = this.indexOfKey(key);

        if (index >= 0) {
            this.removeAt(index);
            return true;
        }

        return false;
    }

    /**
    * Removes the element at the specified index of the SortedList.
    * @param {Number} index The zero-based index of the element to remove.
    */
    removeAt(index) {
        assertType(index, Number);

        if (index < 0 || index >= this.slot.size) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        this.slot.size--;
        this.slot.keys.splice(index, 1);
        this.slot.values.splice(index, 1);
        this.slot.keys.length++;
        this.slot.values.length++;
    }

    /**
    * Sets the value associated with the specified key.
    * @param {Object} key The key whose value to get or set.
    * @param {Object} value The value associated with the specified key.
    */
    set(key, value) {
        let index = this.indexOfKey(key);

        if (index >= 0) {
            this.slot.values[index] = value;
            return;
        }

        this.insert(~index, key, value);
    }

    /**
    * Creates an array from the Sorted-List.
    * @returns {Array}
    */
    toArray() {
        return this.slot.keys;
    }

    /**
    * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
    */
    trimExcess() {
        let threshold = this.slot.keys.length * 0.9;

        if (this.slot.size < threshold) {
            this.capacity(this.slot.size);
        }
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

        let index = this.indexOfKey(key);

        if (index >= 0) {
            callback(this.slot.values[index]);
            return true;
        }

        return false;
    }


    insert(index, key, value) {
        let slot = this.slot;

        if (slot.size === slot.keys.length) {
            let newCapacity = slot.keys.length === 0 ? 4 : slot.keys.length * 2,
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
    }


    get [Symbol.toStringTag]() {
        return 'Sorted List';
    }

    toString() {
        return '[Sorted List]';
    }

    [Symbol.iterator]() {
        let keys = this.slot.keys,
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
}


class SortedListSlot {
    constructor(capacity, size, comparer) {
        this.size = size;
        this.comparer = comparer;
        this.keys = new Array(capacity);
        this.values = new Array(capacity);
    }
}

