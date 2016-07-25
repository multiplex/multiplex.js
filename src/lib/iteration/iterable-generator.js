import Iterable from './iterable';
import iteratorSymbol from './iterator-symbol';
import mixin from '../utils/mixin';
import extend from '../utils/extend';

/**
* Creates a new GeneratorIterable instance.
* @param {Function|Function*} value A generator function.
*/
export default function GeneratorIterable(value) {
    Iterable.call(this, value);
}

extend(GeneratorIterable, Iterable);

GeneratorIterable.prototype[iteratorSymbol] = function () {
    return this.valueOf()();
};

mixin(GeneratorIterable.prototype, {
    toString: function () {
        return '[Generator Iterable]';
    }
});
