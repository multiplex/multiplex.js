/**
* Determines whether an object is instance of a given type.
* @param {Object} obj An object.
* @param {Function} type The type to check.
* @returns {Boolean}
*/
export function is(obj, type) {
    // use 'typeof' operator in an if clause yields in better performance than switch-case

    if (obj === null || obj === undefined) {
        return false;
    }
    if (typeof obj === 'number') {
        return type === Number;
    }
    else if (typeof obj === 'string') {
        return type === String;
    }
    else if (typeof obj === 'function') {
        return type === Function;
    }
    else if (typeof obj === 'boolean') {
        return type === Boolean;
    }
    else {
        return obj instanceof type;
    }
}


/**
* Determines whether the specified object is a Function type.
* @param {Object} fn The object to check.
* @returns {Boolean}
*/
export function isFunc(fn) {
    return typeof fn === 'function';
}


/**
* Determines whether the specified object is array-like.
* @param {Object} obj The object to check.
* @returns {Boolean}
*/
export function isArrayLike(obj) {
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
