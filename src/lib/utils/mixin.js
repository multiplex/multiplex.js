import isFunction from './is-function';
import iteratorSymbol from './iterator-symbol';

export default function mixin(obj, properties, attributes) {
    attributes = attributes || {};

    for (var _prop in properties) {
        if (properties.hasOwnProperty(_prop)) {
            define(obj, _prop, {
                value: properties[_prop],
                writable: attributes.writable || true,
                enumerable: attributes.enumerable || false,
                configurable: attributes.configurable || false
            });
        }
    }

    return obj;
}

export function define(obj, prop, attributes) {
    if (prop === '@@iterator') {
        prop = iteratorSymbol;
    }

    if (isFunction(Object.defineProperty)) {
        Object.defineProperty(obj, prop, attributes);
    }
    else {
        obj[prop] = attributes.get ? attributes.get.apply(obj) : attributes.value;
    }
}

