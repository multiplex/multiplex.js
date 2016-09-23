import List from './list';
import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';
import {ARRAY_PROTOTYPE} from '../utils/builtin-types';
import assertType from '../utils/assert-type';
import extend from '../utils/extend';
import define from '../utils/define';

export default function ReadOnlyCollection(list) {
    assertType(list, List);
    Collection.call(this, list);
    this.list = list;

    define(this, 'length', {
        get: function () {
            return list.length;
        }
    });

    for (var i = 0, len = list.length; i < len; i++) {
        this[i] = list[i];
    }

    Object.freeze(this);
}

extend(ReadOnlyCollection, Collection, {
    /**
    * Gets the number of elements contained in the ReadOnlyCollection.
    * @returns {Number}
    */
    count: function () {
        return this.length;
    },

    /**
    * Determines whether the ReadOnlyCollection contains a specific value.
    * @param {Object} item The object to locate in the ReadOnlyCollection.
    * @returns {Boolean}
    */
    contains: function (item) {
        this.list.contains(item);
    },

    /**
    * Gets the element at the specified index.
    * @param {Number} index The zero-based index of the element to get.
    * @returns {Object}
    */
    get: function (index) {
        return this.list.get(index);
    },

    /**
    * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
    * @param {Object} item The object to locate in the ReadOnlyCollection.
    * @returns {Number}
    */
    indexOf: function (item) {
        return this.list.indexOf(item);
    },

    /**
    * Returns a shallow copy of a portion of the list into a new array object.
    * @param {Number=} begin Zero-based index at which to begin extraction.
    * @param {Number=} end Zero-based index at which to end extraction
    * @returns {Array}
    */
    slice: ARRAY_PROTOTYPE.slice,

    /**
    * Changes the content of the list by removing existing elements and/or adding new elements.
    * @param {Number} start Index at which to start changing the list.
    * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
    * @param {Object...} items The elements to add to the list.
    * @returns {Array}
    */
    splice: ARRAY_PROTOTYPE.splice,

    /**
    * Buffers collection into an array.
    * @returns {Array}
    */
    toArray: function () {
        return this.list.toArray();
    },

    toString: function () {
        return '[ReadOnly Collection]';
    },

    '@@iterator': function () {
        return new ArrayIterator(this);
    }
});
