import error from './error';
import { is } from './is-type';


/**
* Verifies that the specified object is not null. The assertion fails if it is null.
* @param {Object} obj An object.
*/
export function isNotNull(obj) {
    if (obj == null) {
        error('Value cannot be null.');
    }
}


/**
* Verifies that the specified object is an instance of the specified type.
* The assertion fails if the type is not found in the inheritance hierarchy of the object.
* @param {Object} obj An object.
* @param {Function} type The type to check.
*/
export function isType(obj, type) {
    if (!is(obj, type)) {
        error('Invalid parameter type. Expected type: ' + type.name);
    }
}
