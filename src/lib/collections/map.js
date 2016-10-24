import IterableIterator from '../iteration/iterable-iterator';
import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import isArray from '../utils/is-array';
import error from '../utils/error';
import forOf from '../utils/for-of';
import count from '../utils/count';
import defineProperty from '../utils/define-property';
import extend from '../utils/extend';

/**
* Initializes a new instance of the Map class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Map.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
export default function Map(iterable, comparer) {
    var table = new HashTable(comparer);

    if (iterable) {
        forOf(iterable, function (element) {
            if (isArray(element)) {
                table.add(element[0], element[1]);
            }
            else {
                error('Iterator value ' + element + ' is not an entry object');
            }
        });
    }

    this.table = table;
    this.size = this.table.count();

    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(Map, Collection, {
    /**
    * Removes all elements from the Map object.
    */
    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    /**
    * Returns the number of values in the Map object.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    */
    count: function (predicate) {
        return predicate ? count(this, predicate) : this.size;
    },

    /**
    * Removes any value associated to the key and returns the value that Map.prototype.has(key) would have previously returned.
    * @param {Object} key The key of the element to remove from the Map object.
    * @returns {Object}
    */
    delete: function (key) {
        var value = this.table.get(key),
            result = this.table.remove(key);

        this.size = this.table.count();
        return result ? value : false;
    },

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    entries: function () {
        return new MapIterator(this);
    },

    /**
    * Calls callback once for each value present in the Map object, in insertion order.
    * @param {Function} callback Function to execute for each element.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    /**
    * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
    * @param {Object} key The key of the element to return from the Map object.
    * @returns {Object}
    */
    get: function (key) {
        return this.table.get(key);
    },

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Map object or not.
    * @param {Object} key The key of the element to test for presence in the Map object.
    * @returns {Boolean}
    */
    has: function (key) {
        return this.table.contains(key);
    },

    /**
    * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    keys: function () {
        return new MapIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Sets the value for the key in the Map object. Returns the Map object.
    * @param {Object} key The key of the element to add to the Map object.
    * @param {Object} value The value of the element to add to the Map object.
    * @returns {Map}
    */
    set: function (key, value) {
        this.table.set(key, value);
        this.size = this.table.count();
        return this;
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    values: function () {
        return new MapIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Creates an array from the Map.
    * @returns {Array}
    */
    toArray: function () {
        return this.table.entries(false);
    },

    toString: function () {
        return '[Map]';
    },

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    '@@iterator': function () {
        return new MapIterator(this);
    }
});




function MapIterator(map, selector) {
    IterableIterator.call(this, function () {
        return new HashTableIterator(map.table, selector);
    });
}

extend(MapIterator, IterableIterator, {
    toString: function () {
        return '[Map Iterator]';
    }
});
