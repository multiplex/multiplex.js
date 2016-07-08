import valueOf from '../utils/value-of';
import computeObjectEquals from './equals-object';


/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
export default function equals(objA, objB) {
    // Objects are identical
    if (objA === objB) {
        return true;
    }


    // null/undefined is not equal to any object
    else if (
        objA === null || objA === undefined ||
        objB === null || objB === undefined) {
        return objA == objB;
    }


    // built-in value types
    else if (
        typeof objA === 'number' ||
        typeof objA === 'string' ||
        typeof objA === 'boolean') {
        return valueOf(objA) === valueOf(objB);
    }

    // object types equality
    else if (typeof objA === 'object') {
        // Objects are built-in types
        if (objA instanceof Date) {
            return valueOf(objA) === valueOf(objB);
        }

        // Compute overriden 'equals' method for Object types
        else if (typeof objA.__eq__ === 'function') {
            return objA.__eq__(objB);
        }

        // Object types
        else if (typeof objB === 'object') {
            return computeObjectEquals(objA, objB);
        }

        // Objects are already not equal
        return false;
    }


    // Other types: check with auto type conversion
    return objA == objB;
}
