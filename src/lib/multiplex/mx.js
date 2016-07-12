import Iterable from './iterable';

/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} value An Iterable object.
* @returns {Iterable}
*/
export default function mx(value) {
    return value instanceof Iterable ? value : new Iterable(value);
}
