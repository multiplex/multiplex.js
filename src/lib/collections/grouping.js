import Collection from './collection';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
}

extend(Grouping, Collection);

mixin(Grouping.prototype, {
    valueOf: function () {
        return this.elements;
    },

    toString: function () {
        return '[Grouping]';
    }
});
