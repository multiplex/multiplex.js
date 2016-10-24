import Collection from './collection';
import ReadOnlyCollection from './read-only-collection';
import ArrayIterator from '../iteration/iterator-array';
import Comparer from './comparer';

import isNumber from '../utils/is-number';
import isFunction from '../utils/is-function';
import assertNotNull from '../utils/assert-not-null';
import assertType from '../utils/assert-type';
import binarySearch from '../utils/binary-search';
import buffer from '../utils/buffer';
import bufferTo from '../utils/buffer-to';
import count from '../utils/count';
import { ARRAY_PROTOTYPE } from '../utils/builtin-types';
import error, { ERROR_ARGUMENT_OUT_OF_RANGE } from '../utils/error';


/**
* Initializes a new instance of the List class.
* @param {Number|Iterable|...Object=} value The number of elements, Arbitrary number of arguments or the collection whose elements are copied to the new list.
*/
export default class List extends Collection {
    constructor(value) {
        super();
        this.length = 0;

        if (arguments.length === 1) {
            if (isNumber(value)) {
                this.length = value;
            }

            else {
                this.addRange(value);
            }
        }
        else {
            this.addRange(arguments);
        }
    }

    /**
    * Adds an object to the end of the List.
    * @param {Object} item The object to be added to the end of the List.
    */
    add(item) {
        this[this.length++] = item;
    }

    /**
    * Adds the elements of the specified collection to the end of the List.
    * @param {Iterable} collection The collection whose elements should be added to the end of the List.
    */
    addRange(collection) {
        assertNotNull(collection);
        this.insertRange(this.length, collection);
    }

    /**
    * Returns a read-only wrapper for the current list.
    * @returns {ReadOnlyCollection}
    */
    asReadOnly() {
        return new ReadOnlyCollection(this);
    }

    /**
    * Searches a range of elements in the sorted List for an element using the specified comparer and returns the zero-based index of the element.
    * @param {Object} item The object to locate.
    * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
    * @param {Number=} index The zero-based starting index of the range to search.
    * @param {Number=} count The length of the range to search.
    * @returns {Number}
    */
    binarySearch(item, comparer = Comparer.instance, index = 0, count = 0) {
        index = index || 0;
        count = count || this.length;
        comparer = Comparer.from(comparer);

        return binarySearch(this, index, count, item, comparer.compare);
    }

    /**
    * Removes all items from the List.
    */
    clear() {
        shrinkList(this, 0);
    }

    /**
    * Gets the number of elements contained in the List.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count(predicate = null) {
        return predicate ? count(this, predicate) : this.length;
    }

    /**
    * Determines whether the List contains a specific value.
    * @param {Object} item The object to locate in the List.
    * @returns {Boolean}
    */
    contains(item) {
        return ARRAY_PROTOTYPE.includes.call(this, item);
    }

    /**
    * Copies the elements of the List to an Array, starting at a particular Array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from List.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo(array, arrayIndex) {
        bufferTo(this, array, arrayIndex);
    }

    /**
    * Determines whether the List contains elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Boolean}
    */
    exists(match) {
        return this.findIndex(match) !== -1;
    }

    /**
    * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Object}
    */
    find(match) {
        assertType(match, Function);
        return ARRAY_PROTOTYPE.find.call(this, match);
    }

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the zero-based index of the first occurrence within the range of elements
    * in the List that starts at the specified index and contains the specified number of elements.
    * @param {Number|Function} startIndexOrMatch The zero-based starting index of the search or the predicate function, eg. function(item)
    * @param {Number|Function=} countOrMatch The number of elements in the section to search or the predicate function, eg. function(item)
    * @param {Function=} match The predicate function that defines the conditions of the elements to search for, eg. function(item)
    * @returns {Number}
    */
    findIndex(startIndexOrMatch, countOrMatch = null, match = null) {
        let len = this.length,
            startIndex = isNumber(startIndexOrMatch) ? startIndexOrMatch : 0,
            count = isNumber(countOrMatch) ? countOrMatch : len - startIndex;

        match = isFunction(startIndexOrMatch) ? startIndexOrMatch : (isFunction(countOrMatch) ? countOrMatch : match);

        assertType(match, Function);
        validateListIndex(this, startIndex);

        while (count-- > 0 && startIndex < len) {
            if (match(this[startIndex]) === true) {
                return startIndex;
            }

            startIndex++;
        }

        return -1;
    }

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the last occurrence within the entire List.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Object}
    */
    findLast(match) {
        assertType(match, Function);

        let len = this.length;
        while (len-- > 0) {
            if (match(this[len]) === true) {
                return this[len];
            }
        }

        return undefined;
    }

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the zero-based index  of the last occurrence within the range of elements
    * in the List that contains the specified number of elements and ends at the specified index.
    * @param {Number|Function} startIndexOrMatch The zero-based starting index of the search or the predicate, eg. function(item)
    * @param {Number|Function=} countOrMatch The number of elements in the section to search or the predicate, eg. function(item)
    * @param {Function=} match The predicate function that defines the conditions of the elements to search for, eg. function(item)
    * @returns {Number}
    */
    findLastIndex(startIndexOrMatch, countOrMatch = null, match = null) {
        let startIndex = isNumber(startIndexOrMatch) ? startIndexOrMatch : this.length - 1,
            count = isNumber(countOrMatch) ? countOrMatch : startIndex;

        match = isFunction(startIndexOrMatch) ? startIndexOrMatch : (isFunction(countOrMatch) ? countOrMatch : match);

        assertType(match, Function);
        validateListIndex(this, startIndex);

        while (count-- > 0 && startIndex > 0) {
            if (match(this[startIndex]) === true) {
                return startIndex;
            }

            startIndex--;
        }

        return -1;
    }

    /**
    * Retrieves all the elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {List}
    */
    findAll(match) {
        assertType(match, Function);

        let arr = new Array(this.length),
            count = 0;

        for (let i = 0, len = this.length; i < len; i++) {
            if (match(this[i]) === true) {
                arr[count++] = this[i];
            }
        }

        arr.length = count;
        return new List(arr);
    }

    /**
    * Performs the specified action on each element of the List.
    * @param {Function} action The action function to perform on each element of the List. eg. function(item)
    */
    forEach(action, thisArg = null) {
        assertType(action, Function);

        if (thisArg !== null) {
            action = action.bind(thisArg);
        }

        for (let i = 0, len = this.length; i < len; i++) {
            action(this[i]);
        }
    }

    /**
    * Gets the element at the specified index.
    * @param {Number} index The zero-based index of the element to get.
    * @returns {Object}
    */
    get(index) {
        validateListIndex(this, index);
        return this[index];
    }

    /**
    * Creates a shallow copy of a range of elements in the source List.
    * @param {Number} index The zero-based List index at which the range starts.
    * @param {Number} count The number of elements in the range.
    * @returns {List}
    */
    getRange(index, count) {
        validateListIndex(this, index + count - 1);
        return new List(this.slice(index, index + count));
    }

    /**
    * Searches for the specified object and returns the zero-based index of the first occurrence within
    * the range of elements in the List that extends from the specified index to the last element.
    * @param {Object} item The object to locate in the List.
    * @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
    * @returns {Number}
    */
    indexOf(item, index = 0) {
        return ARRAY_PROTOTYPE.indexOf.call(this, item, index);
    }

    /**
    * Inserts an element into the List at the specified index.
    * @param {Number} index The zero-based index at which item should be inserted.
    * @param {Object} item The object to insert.
    */
    insert(index, item) {
        if (index !== this.length) {
            validateListIndex(this, index);
        }

        let len = ++this.length;

        while (len-- > index) {
            this[len] = this[len - 1];
        }

        this[index] = item;
    }

    /**
    * Inserts the elements of a collection into the List at the specified index.
    * @param {Number} index The zero-based index at which item should be inserted.
    * @param {Iterable} collection The collection whose elements should be inserted into the List.
    */
    insertRange(index, collection) {
        assertType(index, Number);
        assertNotNull(collection);

        if (index !== this.length) {
            validateListIndex(this, index);
        }

        let arr = buffer(collection),
            count = arr.length,
            len = this.length + count;

        this.length = len;

        while (len-- > index) {
            this[len] = this[len - count];
        }

        while (count-- > 0) {
            this[index + count] = arr[count];
        }
    }

    /**
    * Searches for the specified object and returns the zero-based index of the last occurrence
    * within the range of elements in the List that extends from the specified index to the last element.
    * @param {Object} item The object to locate in the List.
    * @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
    * @returns {Number}
    */
    lastIndexOf(item, index = 0) {
        return ARRAY_PROTOTYPE.lastIndexOf.call(this, item, index);
    }

    /**
    * Removes the first occurrence of a specific object from the List.
    * @param {Object} item The object to remove from the List.
    * @returns {Boolean}
    */
    remove(item) {
        let index = this.indexOf(item);

        if (index !== -1) {
            this.removeAt(index);
            return true;
        }

        return false;
    }

    /**
    * Removes all the elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
    * @returns {Number}
    */
    removeAll(match) {
        assertType(match, Function);

        let freeIndex = 0,
            len = this.length;

        while (freeIndex < len && !match(this[freeIndex])) {
            freeIndex++;
        }

        if (freeIndex >= len) {
            return 0;
        }

        let current = freeIndex + 1;

        while (current < len) {
            while (current < len && match(this[current])) {
                current++;
            }

            if (current < len) {
                this[freeIndex++] = this[current++];
            }
        }

        shrinkList(this, freeIndex);
        return len - freeIndex;
    }

    /**
    * Removes the element at the specified index of the List.
    * @param {Number} index The zero-based index of the element to remove.
    */
    removeAt(index) {
        validateListIndex(this, index);

        let i = index,
            len = --this.length;

        for (; i < len; i++) {
            this[i] = this[i + 1];
        }

        delete this[len];
    }

    /**
    * Removes a range of elements from the List.
    * @param {Number} index The zero-based index of the element to remove.
    * @param {Number} count The number of elements to remove.
    */
    removeRange(index, count) {
        validateListIndex(this, index + count - 1);

        let len = this.length - count;

        for (; index < len; index++) {
            this[index] = this[index + count];
        }

        shrinkList(this, len);
    }

    /**
    * Reverses the order of the elements in the specified range.
    * @param {Number=} index The zero-based starting index of the range to reverse.
    * @param {Number=} count The number of elements in the range to reverse.
    */
    reverse(index = 0, count = 0) {
        index = index || 0;
        count = count || this.length;
        validateListIndex(this, index + count - 1);

        let arr = this.slice(index, index + count).reverse(),
            len = arr.length;

        while (len-- > 0) {
            this[len + index] = arr[len];
        }
    }

    /**
    * Returns a shallow copy of a portion of the list into a new array object.
    * @param {Number=} begin Zero-based index at which to begin extraction.
    * @param {Number=} end Zero-based index at which to end extraction
    * @returns {Array}
    */
    slice(begin = 0, end = undefined) {
        return ARRAY_PROTOTYPE.slice.call(this, begin, end === undefined ? this.length : end);
    }

    /**
    * Changes the content of the list by removing existing elements and/or adding new elements.
    * @param {Number} start Index at which to start changing the list.
    * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
    * @param {Object...} items The elements to add to the list.
    * @returns {Array}
    */
    splice(start, deleteCount, ...items) {
        return ARRAY_PROTOTYPE.splice.call(this, start, deleteCount, items);
    }

    /**
    * Sets the element at the specified index.
    * @param {Number} index The zero-based index of the element to set.
    * @param {Object} item The object to be added at the specified index.
    */
    set(index, value) {
        validateListIndex(this, index);
        this[index] = value;
    }

    /**
    * Sorts the elements in a range of elements in List using the specified comparer.
    * @param {Number|Function|Comparer} val The starting index, the comparison function or the Comparer.
    * @param {Number=} count The length of the range to sort.
    * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
    */
    sort(indexOrComparer = null, count = 0, comparer = Comparer.instance) {
        let index = isNumber(indexOrComparer) ? indexOrComparer : 0,
            total = count || this.length - index,
            comparision = indexOrComparer === null ? null :
                (isFunction(indexOrComparer) ? indexOrComparer :
                    Comparer.from(comparer || indexOrComparer).compare);

        validateListIndex(this, index + total - 1);

        let arr = this.slice(index, index + total).sort(comparision),
            len = arr.length;

        while (len-- > 0) {
            this[len + index] = arr[len];
        }
    }

    /**
    * Copies the elements of the List to a new array.
    * @returns {Array}
    */
    toArray() {
        return this.slice();
    }

    /**
    * Determines whether every element in the List matches the conditions defined by the specified predicate.
    * @param {Function} match The Predicate function that defines the conditions to check against the elements, eg. function(item)
    * @returns {Boolean}
    */
    trueForAll(match) {
        assertType(match, Function);

        for (let i = 0, len = this.length; i < len; i++) {
            if (match(this[i]) === false) {
                return false;
            }
        }

        return true;
    }

    get [Symbol.toStringTag]() {
        return 'List';
    }

    toString() {
        return '[List]';
    }

    [Symbol.iterator]() {
        return new ArrayIterator(this);
    }
}



/// helper method to shrink the list to lower size and delete upper indexes
function shrinkList(list, newSize) {
    let size = list.length;
    list.length = newSize;

    if (size < newSize) {
        do {
            delete list[newSize];
        }
        while (newSize-- < size);
    }
}


/// helper method to validate index against being out of range
function validateListIndex(list, index) {
    if (index < 0 || index >= list.length) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }
}
