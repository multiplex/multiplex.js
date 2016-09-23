import Collection from './collection';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
}

extend(Grouping, Collection, {
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
