import isFunction from './is-function';

export default function valueOf(obj) {
    if (obj instanceof Date) {
        return obj.getTime();
    }
    else {
        return isFunction(obj.valueOf) ? obj.valueOf() : 0;
    }
}
