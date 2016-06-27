/**
* Determines whether the specified object is array-like.
* @param {Object} obj The object to check.
* @returns {Boolean}
*/
export default function isObjectLiteral(obj) {
    return Object.getPrototypeOf(obj) === Object.prototype;
}
