import Collection from './collection';
import extend from '../utils/extend';

export default function HashSet(comparer) {
    this._comparer = comparer;
}

extend(HashSet, Collection);
