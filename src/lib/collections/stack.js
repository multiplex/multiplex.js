import Collection from './collection';
import buffer from '../utils/buffer';
import extend from '../utils/extend';

export default function Stack(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(Stack, Collection, {
    toString: function () {
        return '[Stack]';
    }
});
