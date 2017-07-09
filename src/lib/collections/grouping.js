import Collection from './collection';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
    Collection.call(this, elements);
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
    }
});