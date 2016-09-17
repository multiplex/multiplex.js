import define from './define';

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
