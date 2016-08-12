import hash from './hash';
import equals from './equals';

export default function computeObjectEquals(objA, objB) {
    // Objects having different hash code are not equal
    // also prevents mutually recursive structures to stack overflow
    if (hash(objA) !== hash(objB)) {
        return false;
    }


    /// Process equality for object literals:
    /// object literals may have equal hash code, we process equality by each property.
    /// regular 'class' instances have different hash code, hence do not fall into following code.
    /// object objA is direct descendant of Object hence no need to check 'hasOwnProperty'

    var val, prop;

    for (prop in objA) {
        val = objA[prop];

        /// Object methods are not considered for equality
        if (typeof val === 'function') {
            continue;
        }

        if (!equals(val, objB[prop])) {
            return false;
        }
    }

    /// no need to browse objB properties, all properties of objA is checked against objB
    /// it is very unlikely for object literals with the same hash code to have different properties
    /// even in such a rare case, objects are considered equal

    return true;
}
