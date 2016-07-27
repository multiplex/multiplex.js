import mixin from '../utils/mixin';
import buffer from '../utils/buffer';
import EmptyIterable from '../iteration/iterable-empty';
import rangeIterator from './range';
import repeatIterator from './repeat';
import selectIterator from './select';
import whereIterator from './where';

export default function linq(iterable) {
    mixin(iterable, {

        /**
        * Returns an empty Iterable.
        * @returns {Iterable}
        */
        empty: function () {
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
        select: function (selector) {
            return selectIterator(this, selector);
        },

        /**
         * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
         * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
         * @returns {Iterable}
         */
        where: function (predicate) {
            return whereIterator(this, predicate);
        },

        /**
        * Creates an array from an Iterable.
        * @returns {Array}
        */
        toArray: function () {
            return buffer(this);
        }
    });
}
