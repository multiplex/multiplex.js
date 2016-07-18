export default function mixin(obj, properties, attributes) {
    attributes = attributes || {};

    for (var _prop in properties) {
        Object.defineProperty(obj, _prop, {
            value: properties[_prop],
            writable: attributes.writable || false,
            enumerable: attributes.enumerable || false,
            configurable: attributes.configurable || false
        });
    }

    return obj;
}
