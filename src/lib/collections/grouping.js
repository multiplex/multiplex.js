import Collection from './collection';
import ArrayIterator from '../iteration/iterator-array';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
}

extend(Grouping, Collection, {
    /**
    * Gets the number of elements in the Grouping.
    * @returns {Number}
    */
    count: function () {
        return this.elements.length;
    },

    /**
    * Creates an array from the Grouping.
    * @returns {Array}
    */
    toArray: function () {
        return this.elements;
    },

    toString: function () {
        return '[Grouping]';
    },

    '@@iterator': function () {
        return new ArrayIterator(this.elements);
    }
});
