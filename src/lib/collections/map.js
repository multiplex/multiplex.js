import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import bufferTo from '../utils/buffer-to';
import isArray from '../utils/is-array';
import error from '../utils/error';
import $iterable from '../iteration/iterable-factory';

/**
* Initializes a new instance of the Map class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Map.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
export default class Map extends Collection {
    constructor(iterable = null, comparer = null) {
        super();
        this.table = new HashTable(comparer);

        if (iterable) {
            for (let element of $iterable(iterable)) {
                if (isArray(element)) {
                    this.table.add(element[0], element[1]);
                }
                else {
                    error('Iterator value ' + element + ' is not an entry object');
                }
            }
        }
    }

    /**
    * Removes all elements from the Map object.
    */
    clear() {
        this.table.clear();
    }

    /**
    * Copies the keys of the Map to an existing one-dimensional Array, starting at the specified array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        bufferTo(this.keys(), array, arrayIndex);
    }

    /**
    * Returns the number of values in the Map object.
    * @returns {Number}
    */
    count() {
        return this.size;
    }

    /**
    * Removes any value associated to the key and returns the value that Map.prototype.has(key) would have previously returned.
    * @param {Object} key The key of the element to remove from the Map object.
    * @returns {Object}
    */
    delete(key) {
        let value = this.table.get(key),
            result = this.table.remove(key);

        return result ? value : false;
    }

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    entries() {
        return new MapIterator(this, -1);
    }

    /**
    * Calls callback once for each value present in the Map object, in insertion order.
    * @param {Function} callback Function to execute for each element.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach(callback, thisArg = null) {
        this.table.forEach(callback, this, thisArg);
    }

    /**
    * Returns the value associated to the key, or undefined if there is none.
    * @param {Object} key The key of the element to return from the Map object.
    * @returns {Object}
    */
    get(key) {
        return this.table.get(key);
    }

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Map object or not.
    * @param {Object} key The key of the element to test for presence in the Map object.
    * @returns {Boolean}
    */
    has(key) {
        return this.table.contains(key);
    }

    /**
    * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    keys() {
        return new MapIterator(this, key => key);
    }

    /**
    * Sets the value for the key in the Map object. Returns the Map object.
    * @param {Object} key The key of the element to add to the Map object.
    * @param {Object} value The value of the element to add to the Map object.
    * @returns {Map}
    */
    set(key, value) {
        this.table.set(key, value);
        return this;
    }

    /**
    * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    values() {
        return new MapIterator(this, (key, value) => value);
    }

    /**
    * Returns an array that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Array}
    */
    valueOf() {
        return this.table.entries();
    }

    /**
    * Returns the number of values in the Map object.
    * @returns {Number}
    */
    get size() {
        return this.table.count();
    }

    get [Symbol.toStringTag]() {
        return 'Map';
    }

    toString() {
        return '[Map]';
    }

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    [Symbol.iterator]() {
        return new MapIterator(this);
    }
}


class MapIterator extends HashTableIterator {
    constructor(map, selector = null) {
        super(map.table, selector);
    }

    get [Symbol.toStringTag]() {
        return 'Map Iterator';
    }

    toString() {
        return '[Map Iterator]';
    }
}
