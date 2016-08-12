import valueOf from '../utils/value-of';
import computeObjectEquals from './equals-object';


/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @param {Boolean} strict If true computes strict equality for object types.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
export default function equals(objA, objB, strict) {
    // Objects are identical
    if (objA === objB) {
        return true;
    }


    // null/undefined is not equal to any object
    else if (
        objA === null || objA === undefined ||
        objB === null || objB === undefined) {
        return false;
    }


    // objA: NaN & objB: NaN
    else if (typeof objA === 'number' && typeof objB === 'number') {
        return isNaN(objA) && isNaN(objB);
    }


    // object types equality
    else if (typeof objA === 'object' && typeof objB === 'object') {
        // Compute overridden 'equals' method for Object types
        if (typeof objA.__eq__ === 'function') {
            return objA.__eq__(objB);
        }

        // objects are not equal under strict mode
        else if (strict === true) {
            return false;
        }

        // built-in object types
        if (
            (objA instanceof Date && objB instanceof Date) ||
            (objA instanceof Number && objB instanceof Number) ||
            (objA instanceof String && objB instanceof String) ||
            (objA instanceof Boolean && objB instanceof Boolean)) {
            return valueOf(objA) === valueOf(objB);
        }

        // Object types
        return computeObjectEquals(objA, objB);
    }


    // Objects are already not equal
    return false;
}
