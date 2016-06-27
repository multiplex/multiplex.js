import Multiplex from './multiplex';

/**
* Creates a new Multiplex instance.
* @param {Multiplex|Iterable|Array|String|Function|Function*|Object} value An Multiplex object.
* @returns {Multiplex}
*/
export default function mx(value) {
    return value instanceof Multiplex ? value : new Multiplex(value);
}
