import isFunction from './is-function';

export default function mixin(obj, properties, attributes) {
    attributes = attributes || {};

    for (var _prop in properties) {
        define(obj, _prop, {
            value: properties[_prop],
            writable: attributes.writable || false,
            enumerable: attributes.enumerable || false,
            configurable: attributes.configurable || false
        });
    }

    return obj;
}

export function define(obj, prop, attributes) {
    if (isFunction(Object.defineProperty)) {
        Object.defineProperty(obj, prop, attributes);
    }
    else {
        obj[prop] = attributes.get ? attributes.get.apply(obj) : attributes.value;
    }
}

