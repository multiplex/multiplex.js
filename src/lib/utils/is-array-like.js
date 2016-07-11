var toString = Object.prototype.toString;

export default function isArrayLike(obj) {
    if (obj !== null &&
        typeof obj === 'object' &&
        typeof obj.length === 'number') {                                       // Array-likes have 'length' property

        if (
            (typeof NodeList === 'function' && obj instanceof NodeList) ||      // NodeList: document.querySelectorAll
            typeof obj.splice === 'function' ||                                 // third party libraries. eg. jQuery
            toString.call(obj) === '[object Arguments]') {                      // arguments
            return true;
        }
    }

    return false;
}
