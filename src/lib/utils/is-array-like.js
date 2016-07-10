const toString = Object.prototype.toString;
const TypedArray = Object.getPrototypeOf(Int8Array);
const NodeListType = typeof NodeList !== 'undefined' ? NodeList : function () { };

export default function isArrayLike(obj) {
    if (
        typeof obj === 'string' ||                              // String
        obj instanceof Array ||                                 // Arrays
        obj instanceof TypedArray ||                            // typed-array
        obj instanceof NodeListType) {                          // NodeList: document.querySelectorAll
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
