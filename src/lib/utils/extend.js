import isFunction from './is-function';

export default function extend(Type, Base) {
    if (isFunction(Object.create)) {
        Type.prototype = Object.create(Base.prototype);
    }
    else {
        var _ = function () { };
        _.prototype = Base.prototype;
        Type.prototype = new _();
    }

    Type.prototype.constructor = Type;
}
