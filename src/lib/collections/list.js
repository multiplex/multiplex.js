import Collection from './collection';
import extend from '../utils/extend';

export default function List(value) {
    this._value = value;
}

extend(List, Collection);
