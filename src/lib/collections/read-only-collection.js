import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';
import {ARRAY_PROTOTYPE} from '../utils/builtin-types';

export default class ReadOnlyCollection extends Collection {
    constructor(list) {
        super(list);
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

    valueOf() {
        return this.slice();
    }

    get [Symbol.toStringTag]() {
        return 'ReadOnly Collection';
    }

    toString() {
        return '[ReadOnly Collection]';
    }

    [Symbol.iterator]() {
        return new ArrayIterator(this);
    }
}
