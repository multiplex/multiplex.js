import error from './error';
import isType from './is-type';

/**
* Verifies that the specified object is an instance of the specified type.
* The assertion fails if the type is not found in the inheritance hierarchy of the object.
* @param {Object} obj An object.
* @param {Function} type The type to check.
*/
export default function assertType(obj, type) {
    if (!isType(obj, type)) {
        error('Invalid parameter type. Expected type: ' + type.name);
    }
}
