import Collection from './collection';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
}

extend(Grouping, Collection, {
    valueOf: function () {
        return this.elements;
    },

    toString: function () {
        return '[Grouping]';
    }
});
