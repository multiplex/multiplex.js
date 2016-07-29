import mixin from '../utils/mixin';
import buffer from '../utils/buffer';
import EmptyIterable from '../iteration/iterable-empty';
import range from './range';
import repeat from './repeat';
import aggregate from './aggregate';
import all from './all';
import any from './any';
import average from './average';
import concat from './concat';
import count from './count';
import select from './select';
import where from './where';


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
        range: range,

        /**
        * Generates a sequence that contains one repeated value.
        * @param {Object} element The value to be repeated.
        * @param {Number} count The number of times to repeat the value in the generated sequence.
        * @returns {Iterable}
        */
        repeat: repeat
    });

    mixin(iterable.prototype, {

        /**
        * Applies an accumulator function over a sequence.
        * @param {Object} seed The initial accumulator value.
        * @param {Function} func An accumulator function to be invoked on each element. eg. function(accumulate, item)
        * @param {Function} resultSelector A function to transform the final accumulator value into the result value. eg. function(accumulate)
        * @returns {Object}
        */
        aggregate(seed, func, resultSelector = element => element) {
            return aggregate(this, func, resultSelector);
        },

        /**
        * Determines whether all elements of a sequence satisfy a condition.
        * Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
        * @param {Function} predicate A function to test each element for a condition. eg. function(item).
        * @returns {Boolean}
        */
        all(predicate) {
            return all(this, predicate);
        },

        /**
        * Determines whether a sequence contains any elements.
        * Returns true if any elements in the source sequence contains any elements or pass the test in the specified predicate; otherwise, false.
        * @param {Function=} predicate A function to test each element for a condition. eg. function(item).
        * @returns {Boolean}
        */
        any(predicate = () => true) {
            return any(this, predicate);
        },

        /**
        * Computes the average of a sequence of numeric values.
        * @param {Function=} selector A transform function to apply to each element. eg.function(item).
        * @returns {Number}
        */
        average(selector = null) {
            return average(this, selector);
        },

        /**
        * Concatenates two sequences.
        * @param {Iterable} second The sequence to concatenate to current sequence.
        * @returns {Iterable}
        */
        concat(second) {
            return concat(this, second);
        },

        /**
        * Returns the number of elements in a sequence.
        * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
        * @returns {Number}
        */
        count(predicate) {
            return count(this, predicate);
        },

        /**
        * Projects each element of a sequence into a new form.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        select(selector) {
            return select(this, selector);
        },

        /**
        * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
        * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        where(predicate) {
            return where(this, predicate);
        },

        /**
        * Creates an array from an Iterable.
        * @returns {Array}
        */
        toArray() {
            return buffer(this);
        }
    });
}

