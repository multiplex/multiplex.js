import isFunction from './is-function';
import iteratorSymbol from './iterator-symbol';

export default function defineProperty(obj, prop, attributes) {
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
