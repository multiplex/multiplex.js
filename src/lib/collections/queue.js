import Collection from './collection';
import buffer from '../utils/buffer';
import extend from '../utils/extend';

export default function Queue(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(Queue, Collection, {
    toString: function () {
        return '[Queue]';
    }
});
