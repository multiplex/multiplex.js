import {OBJECT_PROTOTYPE} from './builtin-types';

export default function isObjectLiteral(obj) {
    return Object.getPrototypeOf(obj) === OBJECT_PROTOTYPE;
}
