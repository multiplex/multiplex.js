import Collection from './collection';
import extend from '../utils/extend';

export default function ReadOnlyCollection(list) {
    Collection.call(this, list);
}

extend(ReadOnlyCollection, Collection, {
});
