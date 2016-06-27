import error from './error';

/**
* Verifies that the specified object is not null. The assertion fails if it is null.
* @param {Object} obj An object.
*/
export default function assertNotNull(obj) {
    if (obj == null) {
        error('Value cannot be null.');
    }
}
