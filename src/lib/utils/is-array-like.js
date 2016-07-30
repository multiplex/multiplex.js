import toString from './to-string';

export default function isArrayLike(obj) {
    // - Array
    // - String
    //
    // - Typed arrays:
    //      Int8Array, Int16Array, Int32Array,
    //      Uint8Array, Uint16Array, Unit32Array, Uint8ClampedArray
    //      Float32Array, Float64Array
    //
    // - NodeList: document.querySelectorAll
    // - HTMLCollection: document.forms
    // - HTMLFormControlsCollection: forms.elements
    // - arguments object
    // - objects with 'length' and 'slice' properties

    if (typeof obj === 'string' ||
        obj instanceof Array) {
        return true;
    }

    else if (
        typeof obj === 'object' &&                          // array-likes are objects
        typeof obj.length === 'number') {                   // array-likes have 'length' property

        if (typeof obj.splice === 'function' ||             // third party libraries. eg. jQuery
            toString(obj) === '[object Arguments]') {       // arguments object
            return true;
        }
        else {
            var len = obj.length;
            if (len > 0 &&                                  // length property must be > 0
                len % 1 === 0 &&                            // length property must be integer
                obj[len - 1] !== undefined) {               // at least one index is being checked)
                return true;
            }
        }
    }

    return false;
}
