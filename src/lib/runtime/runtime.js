import hash from './hash';
import hashSymbol from './hash-symbol';
import combineHash from './hash-combine';
import equals from './equals';
import equalsSymbol from './equals-symbol';
import compare from './compare';
import compareSymbol from './compare-symbol';
import iteratorSymbol from '../iteration/iterator-symbol';


var runtime = {
    strictMode: false,
    hash: hash,
    hashSymbol: hashSymbol,
    equals: equals,
    equalsSymbol: equalsSymbol,
    compare: compare,
    compareSymbol: compareSymbol,
    iteratorSymbol: iteratorSymbol
};


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @param {...Objects} rest Optional number of objects to combine their hash codes.
* @returns {Number}
*/
function computeHash(obj) {
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
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
function computeEquals(objA, objB) {
    return equals(objA, objB, false);
}


export {computeHash};
export {computeEquals};
export {compare as computeCompare};
export default runtime;
