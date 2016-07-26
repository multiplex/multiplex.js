import isFunction from './is-function';

export default function valueOf(obj) {
    if (obj instanceof Date) {
        return isFunction(obj.getTime) ? obj.getTime() : 0;
    }
    else {
        return isFunction(obj.valueOf) ? obj.valueOf() : 0;
    }
}
