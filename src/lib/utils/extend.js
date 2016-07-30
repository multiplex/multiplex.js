import isFunction from './is-function';

/*jshint newcap:false*/
export default function extend(type, superType) {
    if (isFunction(Object.create)) {
        type.prototype = Object.create(superType.prototype);
    }
    else {
        var Super = function () { };
        Super.prototype = superType.prototype;
        type.prototype = new Super();
    }

    type.prototype.constructor = type;
}
