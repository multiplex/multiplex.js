var getPrototypeOf = Object.getPrototypeOf || function (obj) {
    return obj.__proto__ == Object.prototype;
};

export default function isObjectLiteral(obj) {
    return getPrototypeOf(obj) === Object.prototype;
}
