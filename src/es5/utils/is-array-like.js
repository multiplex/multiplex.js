/**
* Determines whether the specified object is array-like.
* @param {Object} obj The object to check.
* @returns {Boolean}
*/
export default function isArrayLike(obj) {
    if (obj instanceof Array || typeof obj === 'string') {                      // Arrays/String
        return true;
    }
    else if (typeof obj === 'object' && typeof obj.length === 'number') {       // Array-likes have 'length' property (excelude 'function' type)

        if (typeof obj.splice === 'function' ||                                 // third party libraries. eg. jQuery
            obj.toString() === '[object Arguments]' ||                          // arguments
            obj.buffer ||                                                       // typed-array
            obj instanceof NodeList) {                                          // NodeList: document.querySelectorAll
            return true;
        }
    }

    return false;
}
