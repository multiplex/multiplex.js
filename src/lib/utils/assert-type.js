import error from './error';
import isType from './is-type';

export default function assertType(obj, type) {
    if (!isType(obj, type)) {
        error('Invalid parameter type. Expected type: ' + type.name);
    }
}
