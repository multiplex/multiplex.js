import Collection from './collection';
import buffer from '../utils/buffer';
import extend from '../utils/extend';

export default function SortedList(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(SortedList, Collection, {
    toString: function () {
        return '[Sorted List]';
    }
});
