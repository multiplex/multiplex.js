import iterable from './iterable-factory';

/**
* Creates an iterator object
* @param {Object} obj An object to create iterator from.
*/
export default function iterator(obj) {
    return iterable(obj)[Symbol.iterator]();
}
