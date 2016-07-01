import hash from './hash';
import equalsSymbol from './equals-symbol';


/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @param {EqualityComparer=} comparer An equality comparer to compare values.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
export default function equals(objA, objB, comparer = null) {
    // Objects are identical (including null)
    if (objA === objB) {
        return true;
    }

    // null is not equal to any object
    else if (objA == null || objB == null) {
        return false;
    }


    // compare using 'equalityComparer' provided
    if (comparer) {
        return comparer.hash(objA) === comparer.hash(objB) && comparer.equals(objA, objB);
    }


    // Objects check for equality for primitive types
    if (typeof objA === 'number' ||
        typeof objA === 'string' ||
        typeof objA === 'boolean') {
        return objA == objB;
    }

    else if (typeof objA === 'object') {
        // Objects are from 'Date' type
        if (objA instanceof Date) {
            return objB instanceof Date && objA.getTime() === objB.getTime();
        }

        // Compute overriden 'equals' method for Object types
        else if (typeof objA[equalsSymbol] === 'function') {
            return objA[equalsSymbol](objB);
        }

        // Object types
        else if (typeof objB === 'object') {
            // Objects having different hash code are not equal
            if (hash(objA) !== hash(objB)) {
                return false;
            }


            /// Process equality for object literals:
            /// object literals may have equal hash code, we process equality by each property.
            /// regular 'class' instances have different hash code, hence do not fall into following code.
            /// object objA is direct descendant of Object hence no need to check 'hasOwnProperty'

            var _val, _prop;

            for (_prop in objA) {
                _val = objA[_prop];

                /// Object methods are not considered for equality
                if (typeof _val === 'function') {
                    continue;
                }

                if (!equals(_val, objB[_prop])) {
                    return false;
                }
            }

            /// no need to browse objB properties, all properties of objA is checked against objB
            /// it is very unlikely for object literals with the same hash code to have different properties
            /// even in such a rare case, objects are considered equal

            return true;
        }

        // Objects are equal (with auto type conversion)
        // Objects from the same type are considered equal (eg. new Number(1) and 1)
        return objA == objB;
    }


    // Objects are already not equal
    return false;
}
