export default function value(obj) {
    return typeof obj.valueOf === 'function' ? obj.valueOf() : 0;
}
