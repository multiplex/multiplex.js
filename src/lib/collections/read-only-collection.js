import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';
import {ARRAY_PROTOTYPE} from '../utils/builtin-types';
import extend from '../utils/extend';

export default function ReadOnlyCollection(list) {
    Collection.call(this, list);
}

extend(ReadOnlyCollection, Collection, {
    /**
    * Returns a shallow copy of a portion of the list into a new array object.
    * @param {Number=} begin Zero-based index at which to begin extraction.
    * @param {Number=} end Zero-based index at which to end extraction
    * @returns {Array}
    */
    slice: ARRAY_PROTOTYPE.slice,

    valueOf: function () {
        return this.slice();
    },

    toString: function () {
        return '[ReadOnly Collection]';
    },

    '@@iterator': function () {
        return new ArrayIterator(this);
    }
});
