export const compareSymbol = '__cmp__';

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
    else if (objA == null) {
        return -1;
    }

    // Everything is greater than null or undefined
    else if (objB == null) {
        return 1;
    }
    else {
        // numbers compare using 'gt' operator
        if (typeof objA === 'number') {
            return Number.isNaN(objA) ? -1 :
                Number.isNaN(objB) ? 1 :
                    objA > objB ? 1 : -1;
        }

        // booleans compare using 'gt' operator
        if (typeof objA === 'boolean') {
            return objA > objB ? 1 : -1;
        }

        // Strings are compared using String.prototype.localeCompare method
        else if (typeof objA === 'string') {
            return objA.localeCompare(objB);
        }

        else {
            try {
                // Dates are compared using 'getTime' method
                if (objA instanceof Date &&
                    objB instanceof Date) {
                    let _t1 = objA.getTime(),
                        _t2 = objB.getTime();

                    return _t1 > _t2 ? 1 : (_t1 < _t2 ? -1 : 0);
                }

                // Compute overriden '__cmp__' method
                else if (typeof objA.__cmp__ === 'function') {
                    return objA.__cmp__(objB);
                }

                // All other objects are compared using 'valudOf' method
                else {
                    let _v1 = typeof objA.valueOf === 'function' ? objA.valueOf() : 0,
                        _v2 = typeof objB.valueOf === 'function' ? objB.valueOf() : 0;

                    return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
                }
            }
            // in case 'getTime' or 'valueOf' throw error
            catch (e) {
                return 0;
            }
        }
    }
}
