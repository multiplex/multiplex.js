export default function valueOf(obj) {
    if (obj === null || obj === undefined) {
        return 0;
    }
    else if (obj instanceof Date) {
        return typeof obj.getTime === 'function' ? obj.getTime() : 0;
    }
    else {
        return typeof obj.valueOf === 'function' ? obj.valueOf() : 0;
    }
}
