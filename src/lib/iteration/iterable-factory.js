import isObject from '../utils/is-object';
import isFunction from '../utils/is-function';
import isArrayLike from '../utils/is-array-like';
import Iterable from './iterable';
import ArrayIterable from './iterable-array';
import ObjectIterable from './iterable-object';
import GeneratorIterable from './iterable-generator';
import EmptyIterable from './iterable-empty';
import iteratorSymbol from './iterator-symbol';


export default function iterable(value) {
    if (value === null || value === undefined) {
        return new EmptyIterable();
    }

    if (value instanceof Iterable) {
        return value;
    }

    else if (isArrayLike(value)) {
        return new ArrayIterable(value);
    }

    else if (isFunction(value)) {
        return new GeneratorIterable(value);
    }

    else if (isFunction(value[iteratorSymbol])) {
        return new Iterable(value);
    }

    else if (isObject(value)) {
        return new ObjectIterable(value);
    }

    return new ArrayIterable([value]);
}
