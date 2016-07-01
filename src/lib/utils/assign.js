import isFunc from './is-function';

export default function assign(target, source) {
    if (isFunc(Object.assign)) {
        Object.assign(target, source);
    }
    else {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    }
}
