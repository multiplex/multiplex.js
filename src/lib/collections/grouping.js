import Collection from './collection';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

export default function Grouping(key, elements) {
    Collection.call(this, elements);
    this.key = key;
    this.elements = elements;
}

extend(Grouping, Collection);

mixin(Grouping.prototype, {
    toString: function () {
        return '[Grouping]';
    }
});
