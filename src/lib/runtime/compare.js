import valueOf from '../utils/value-of';

/**
* Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Number}
*/
export default function compare(objA, objB) {
    // Identical objects
    if (objA === objB) {
        return 0;
    }

    // null or undefined is less than everything
    else if (objA === null || objA === undefined) {
        return -1;
    }

    // Everything is greater than null or undefined
    else if (objB === null || objB === undefined) {
        return 1;
    }

    // numbers compare using 'gt' operator
    else if (typeof objA === 'number') {
        return isNaN(objA) ? -1 :
            isNaN(objB) ? 1 :
                objA > objB ? 1 : -1;
    }

    // booleans compare using 'gt' operator
    else if (typeof objA === 'boolean') {
        return objA ? 1 : -1;
    }

    // Strings are compared using String.prototype.localeCompare method
    else if (typeof objA === 'string') {
        return objA.localeCompare(objB);
    }

    // Compute overriden 'compare' method for Object types
    else if (typeof objA.__cmp__ === 'function') {
        return objA.__cmp__(objB);
    }

    // All other objects are compared using 'valudOf' method
    else {
        var _v1 = valueOf(objA),
            _v2 = valueOf(objB);

        return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
    }
}
