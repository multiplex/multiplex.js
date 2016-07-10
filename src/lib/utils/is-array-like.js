var toString = Object.prototype.toString;
var nodeListType = typeof NodeList !== 'undefined' ? true : false;
var TypedArray = typeof Int8Array !== 'undefined' ? Object.getPrototypeOf(Int8Array) : null;

export default function isArrayLike(obj) {
    if (
        typeof obj === 'string' ||                              // String
        obj instanceof Array ||                                 // Arrays
        (TypedArray && obj instanceof TypedArray) ||            // typed-array
        (nodeListType && obj instanceof NodeList)) {            // NodeList: document.querySelectorAll
        return true;
    }
    else if (obj !== null &&
        typeof obj === 'object' &&
        typeof obj.length === 'number') {                       // Array-likes have 'length' property (excelude 'function' type)

        if (typeof obj.splice === 'function' ||                 // third party libraries. eg. jQuery
            toString.call(obj) === '[object Arguments]') {      // arguments
            return true;
        }
    }

    return false;
}
