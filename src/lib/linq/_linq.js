import mixin from '../utils/mixin';
import isFunction from '../utils/is-function';

import EmptyIterable from '../iteration/iterable-empty';
import EqualityComparer from '../collections/equality-comparer';
import List from '../collections/list';
import Lookup from '../collections/lookup';
import buffer from '../utils/buffer';
import range from './range';
import repeat from './repeat';
import aggregate from './aggregate';
import all from './all';
import any from './any';
import average from './average';
import concat from './concat';
import contains from './contains';
import count from './count';
import defaultIfEmpty from './default-if-empty';
import distinct from './distinct';
import elementAt from './element-at';
import exceptIntersect from './except-intersect';
import first from './first';
import firstOrDefault from './first-or-default';
import forEach from './for-each';
import groupBy from './group-by';
import join from './join';
import last from './last';
import lastOrDefault from './last-or-default';
import minMax from './min-max';
import ofType from './of-type';
import reverse from './reverse';
import select from './select';
import selectMany from './select-many';
import sequenceEqual from './sequence-equal';
import single from './single';
import singleOrDefault from './single-or-default';
import skip from './skip';
import skipWhile from './skip-while';
import sum from './sum';
import take from './take';
import takeWhile from './take-while';
import union from './union';
import where from './where';
import zip from './zip';


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
        * Determines whether a sequence contains a specified element by using an equality comparer.
        * @param {Object} value The value to locate in the sequence.
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Boolean}
        */
        contains(value, comparer = EqualityComparer.defaultComparer) {
            return contains(this, value, comparer);
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
        * Returns the elements of the specified sequence or the specified value in a collection if the sequence is empty.
        * @param {Object=} defaultValue The value to return if the sequence is empty.
        * @returns {Iterable}
        */
        defaultIfEmpty(defaultValue = null) {
            return defaultIfEmpty(this, defaultValue);
        },

        /**
        * Produces the set difference of two sequences by using the EqualityComparer to compare values.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        distinct(comparer = EqualityComparer.defaultComparer) {
            return distinct(this, comparer);
        },

        /**
        * Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.
        * @param {Number} index The zero-based index of the element to retrieve.
        * @returns {Object}
        */
        elementAt(index) {
            return elementAt(this, index);
        },

        /**
        * Produces the set difference of two sequences by using the specified EqualityComparer to compare values.
        * @param {Iterable} second An Iterable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        except(second, comparer = EqualityComparer.defaultComparer) {
            return exceptIntersect(this, second, false, comparer);
        },

        /**
        * Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        first(predicate = null) {
            return first(this, predicate);
        },

        /**
        * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        firstOrDefault(predicate = null, defaultValue = null) {
            return firstOrDefault(this, predicate, defaultValue);
        },

        /**
        * Performs the specified action on each element of an Iterable.
        * @param {Function} action The action function to perform on each element of an Iterable. eg. function(item, index)
        */
        forEach(action) {
            return forEach(this, action);
        },

        /**
        * Groups the elements of a sequence according to a key selector function.
        * @param {Function} keySelector A function to extract the key for each element. eg. function(item)
        * @param {Function|EqualityComparer=} elementSelectorOrComparer A function to map each source element to an element in the Grouping. eg. function(item) or an equality comparer
        * @param {Function|EqualityComparer=} resultSelectorOrComparer A function to extract the key for each element. eg. function(item) or an equality comparer
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Iterable}
        */
        groupBy: function (keySelector, elementSelectorOrComparer = null, resultSelectorOrComparer = null, comparer = EqualityComparer.defaultComparer) {
            let args = arguments.length,
                elementSelector = isFunction(elementSelectorOrComparer) ? elementSelectorOrComparer : undefined,
                resultSelector = isFunction(resultSelectorOrComparer) ? resultSelectorOrComparer : undefined;

            comparer = args === 3 && elementSelector === undefined ? elementSelectorOrComparer :
                (args === 4 && resultSelector === undefined ? resultSelectorOrComparer : comparer);

            return groupBy(this, keySelector, elementSelector, resultSelector, comparer);
        },

        /**
        * Produces the set intersection of two sequences by using the default equality comparer to compare values.
        * @param {Iterable} second An Iterable whose distinct elements that also appear in the first sequence will be returned.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        intersect(second, comparer = EqualityComparer.defaultComparer) {
            return exceptIntersect(this, second, true, comparer);
        },

        /**
        * Correlates the elements of two sequences based on matching keys. A specified EqualityComparer is used to compare keys.
        * @param {Iterable} inner The sequence to join to the current sequence.
        * @param {Function} outerKeySelector A function to extract the join key from each element of the first sequence. eg. function(outer)
        * @param {Function} innerKeySelector A function to extract the join key from each element of the second sequence. function(inner)
        * @param {Function} resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Iterable}
        */
        join: function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
            return join(this, inner, outerKeySelector, innerKeySelector, comparer);
        },

        /**
        * Returns the last element of a sequence that satisfies a specified condition.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        last(predicate = null) {
            return last(this, predicate);
        },

        /**
        * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        lastOrDefault(predicate = null, defaultValue = null) {
            return lastOrDefault(this, predicate, defaultValue);
        },

        /**
        * Invokes a transform function on each element of a sequence and returns the maximum value.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Object}
        */
        max(selector = null) {
            return minMax(this, true, selector);
        },

        /**
        * Invokes a transform function on each element of a sequence and returns the minimum value.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Object}
        */
        min(selector = null) {
            return minMax(this, false, selector);
        },

        /**
        * Filters the elements of an Iterable based on a specified type.
        * @param {Function} type The type to filter the elements of the sequence on.
        * @returns {Iterable}
        */
        ofType(type) {
            return ofType(this, type);
        },

        /**
        * Inverts the order of the elements in a sequence.
        * @returns {Iterable}
        */
        reverse() {
            return reverse(this);
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
        * Projects each element of a sequence to an Iterable and flattens the resulting sequences into one sequence.
        * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @param {Function=} resultSelector A transform function to apply to each element of the intermediate sequence. eg. function(item, collection)
        * @returns {Iterable}
        */
        selectMany(collectionSelector, resultSelector = null) {
            return selectMany(this, collectionSelector, resultSelector);
        },

        /**
        * Determines whether two sequences are equal by comparing their elements by using an EqualityComparer.
        * @param {Iterable} second An Iterable to compare to the first sequence.
        * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
        * @returns {Boolean}
        */
        sequenceEqual(second, comparer = EqualityComparer.defaultComparer) {
            return sequenceEqual(this, second, comparer);
        },

        /**
        * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        single(predicate = null) {
            return single(this, predicate);
        },

        /**
        * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        singleOrDefault(predicate = null, defaultValue = null) {
            return singleOrDefault(this, predicate, defaultValue);
        },

        /**
        * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
        * @param {Number} count The number of elements to skip before returning the remaining elements.
        * @returns {Iterable}
        */
        skip(count) {
            return skip(this, count);
        },

        /**
        * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
        * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        skipWhile(predicate) {
            return skipWhile(this, predicate);
        },

        /**
        * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Number}
        */
        sum(selector = null) {
            return sum(this, selector);
        },

        /**
        * Returns a specified number of contiguous elements from the start of a sequence.
        * @param {Number} count The number of elements to return.
        * @returns {Iterable}
        */
        take(count) {
            return take(this, count);
        },

        /**
        * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
        * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. Function(item, index)
        * @returns {Iterable}
        */
        takeWhile(predicate) {
            return takeWhile(this, predicate);
        },

        /**
        * Creates an array from an Iterable.
        * @returns {Array}
        */
        toArray() {
            return buffer(this);
        },

        /**
        * Creates a List from an Iterable.
        * @returns {List}
        */
        toList() {
            return new List(this);
        },

        /**
        * Creates a Lookup from an Iterable according to a specified key selector function, a comparer and an element selector function.
        * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
        * @param {Function=} valueSelector A transform function to produce a result element value from each element. eg. function(item)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Lookup}
        */
        toLookup(keySelector, valueSelector = null, comparer = EqualityComparer.defaultComparer) {
            return new Lookup(this, keySelector, valueSelector, comparer);
        },

        /**
        * Produces the set union of two sequences by using a specified EqualityComparer.
        * @param {Iterable} second An Iterable whose distinct elements form the second set for the union.
        * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
        * @returns {Iterable}
        */
        union(second, comparer = EqualityComparer.defaultComparer) {
            return union(this, second, comparer);
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
        * Merges two sequences by using the specified predicate function.
        * @param {Iterable} second The second sequence to merge.
        * @param {Function} resultSelector A function that specifies how to merge the elements from the two sequences. eg. function(first, second)
        * @returns {Iterable}
        */
        zip(second, resultSelector) {
            return zip(this, second, resultSelector);
        }
    });
}

