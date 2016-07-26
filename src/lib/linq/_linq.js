import mixin from '../utils/mixin';
import EmptyIterable from '../iteration/iterable-empty';
import rangeIterator from './range';
import repeatIterator from './repeat';
import selectIterator from './select';
import toArray from './to-array';

export default function linq(iterable) {
    mixin(iterable, {

        /**
        * Returns an empty Iterable.
        * @returns {Iterable}
        */
        empty() {
            return new EmptyIterable();
        },

        /**
        * Generates a sequence of integral numbers within a specified range.
        * @param {Number} start The value of the first integer in the sequence.
        * @param {Number} count The number of sequential integers to generate.
        * @returns {Iterable}
        */
        range: rangeIterator,

        /**
        * Generates a sequence that contains one repeated value.
        * @param {Object} element The value to be repeated.
        * @param {Number} count The number of times to repeat the value in the generated sequence.
        * @returns {Iterable}
        */
        repeat: repeatIterator
    });

    mixin(iterable.prototype, {

        /**
        * Projects each element of a sequence into a new form.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        select(selector) {
            return selectIterator(this, selector);
        },

        /**
        * Creates an array from an Iterable.
        * @returns {Array}
        */
        toArray() {
            return toArray(this);
        }
    });
}
