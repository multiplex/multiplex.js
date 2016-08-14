import valueOf from '../utils/value-of';
import compute31BitNumberHash from './hash-number';
import compute31BitStringHash from './hash-string';
import compute31BitDateHash from './hash-date';
import compute31BitObjecHash from './hash-object';


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @returns {Number}
*/
export default function hash(obj, strict) {
    // null/undefined hash is 0
    if (obj === null || obj === undefined) {
        return 0;
    }


    // Compute 'Number' primitive type hash (does not incluede 'new Number(value)')
    else if (typeof obj === 'number') {
        return compute31BitNumberHash(obj);
    }


    // Compute 'String' primitive type hash (does not incluede 'new String(value)')
    else if (typeof obj === 'string') {
        return compute31BitStringHash(obj);
    }


    // Compute 'Boolean' primitive type hash (does not incluede 'new Boolean(value)')
    else if (typeof obj === 'boolean') {
        return obj ? 1 : 0;
    }


    // Compute 'Objects' hash
    else {
        // Compute overridden 'hash' method
        if (typeof obj.__hash__ === 'function') {
            return obj.__hash__() >> 32;
        }

        // Compute primitive object types hash only in non-strict mode
        else if (strict !== true) {
            // Compute 'Date' object type hash
            if (obj instanceof Date) {
                return compute31BitDateHash(obj);
            }

            // Compute built-in types hash
            else if (
                obj instanceof Number ||
                obj instanceof String ||
                obj instanceof Boolean) {
                return hash(valueOf(obj), false);
            }
        }

        // Compute 'Object' type hash for all other types
        return compute31BitObjecHash(obj, strict);
    }
}
