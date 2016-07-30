import isFunction from './is-function';

export default function toString(obj) {
    return isFunction(obj.toString) ? obj.toString() : '';
}
