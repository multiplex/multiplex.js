export default function isObjectLiteral(obj) {
    return Object.getPrototypeOf(obj) === Object.prototype;
}
