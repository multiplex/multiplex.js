import hash from './hash';
import hashSymbol from './hash-symbol';
import combineHash from './hash-combine';
import equals from './equals';
import equalsSymbol from './equals-symbol';
import compare from './compare';
import compareSymbol from './compare-symbol';
import iteratorSymbol from '../utils/iterator-symbol';


var runtime = {
    strictMode: false,
    hash: hash,
    hashMany: hashMany,
    hashSymbol: hashSymbol,
    equals: equals,
    equalsSymbol: equalsSymbol,
    compare: compare,
    compareSymbol: compareSymbol,
    iteratorSymbol: iteratorSymbol
};

export default runtime;


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @param {...Objects} rest Optional number of objects to combine their hash codes.
* @returns {Number}
*/
function hashMany(obj) {
    var h = hash(obj, false);

    // Combine hash codes for given inputs
    if (arguments.length > 1) {
        var len = arguments.length,
            i = 0;

        while (i < len) {
            h = combineHash(h, hash(arguments[i++], false));
        }
    }

    return h;
}


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @returns {Number}
*/
export function runtimeHash(obj) {
    return hash(obj, runtime.strictMode);
}


/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
export function runtimeEquals(objA, objB) {
    return equals(objA, objB, runtime.strictMode);
}


/**
* Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Number}
*/
export {compare as runtimeCompare};
