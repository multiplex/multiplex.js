export default function toString(obj) {
    return typeof obj.toString === 'function' ? obj.toString() : '';
}
