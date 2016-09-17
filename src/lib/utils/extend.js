import mixin from './mixin';
import isFunction from './is-function';

export default function extend(type, superType, properties) {
    if (isFunction(Object.create)) {
        type.prototype = Object.create(superType.prototype);
    }
    else {
        var Super = function () { };
        Super.prototype = superType.prototype;
        type.prototype = new Super();
    }

    type.prototype.constructor = type;

    if (properties) {
        mixin(type.prototype, properties);
    }
}
