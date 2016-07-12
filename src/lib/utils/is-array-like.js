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


    if (typeof obj === 'string' ||
        obj instanceof Array) {
        return true;
    }


    if (obj != null &&
        typeof obj === 'object' &&                      // array-likes are objects
        typeof obj.length === 'number') {               // array-likes have 'length' property
        var len = obj.length;

        if (typeof obj.splice === 'function' ||
            (
                len >= 0 &&                             // length property must be > 1
                len % 1 === 0 &&                        // length property must be integer
                obj[len - 1] !== undefined              // at least one index is being checked
            )) {
            return true;
        }
    }

    return false;
}
