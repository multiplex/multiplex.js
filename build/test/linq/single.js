(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var array = [1, 2, 3, 4, 5];
    var enumerable = mx__default['default'].range(1, 5);
    var collection = new mx__default['default'].Collection(array);
    var list = new mx__default['default'].List(array);
    var linkedList = new mx__default['default'].LinkedList(array);
    var hashSet = new mx__default['default'].HashSet(array);
    var stack = new mx__default['default'].Stack(array);
    var queue = new mx__default['default'].Queue(array);
    var set = new mx__default['default'].Set(array);
    var map = new mx__default['default'].Map();
    var dictionary = new mx__default['default'].Dictionary();
    var sortedList = new mx__default['default'].SortedList();
    var readOnlyCollection = list.asReadOnly();
    var lookup = new mx__default['default'].Lookup(array, function (t) {
        return t;
    });

    for (var i = 0; i < array.length; i++) {
        map.set(array[i], array[i]);
        dictionary.set(array[i], array[i]);
        sortedList.add(array[i], array[i]);
    }

    var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
    var qmodule = qunit.module;
    var qtest = qunit.test;
    qunit.expect;

    qmodule('linq-single');

    function simpleNumericPredicate(t) {
        return t > 4;
    }


    qtest('basic "single" test', function (assert) {
        assert.equal(mx__default['default']([1]).single(), 1, 'single of an array of numbers');
        assert.equal(mx__default['default'](array).single(simpleNumericPredicate), 5, 'single of an array of numbers with predicate');
        assert.equal(mx__default['default']('t').single(), 't', 'single of an string');
    });


    qtest('collections "single" method tests', function (assert) {
        assert.equal(enumerable.single(simpleNumericPredicate), 5, 'Test "single" in an enumerable with predicate');
        assert.equal(collection.single(simpleNumericPredicate), 5, 'Test "single" in an Collection with predicate');
        assert.equal(list.single(simpleNumericPredicate), 5, 'Test "single" in a List with predicate');
        assert.equal(readOnlyCollection.single(simpleNumericPredicate), 5, 'Test "single" in a ReadOnlyCollection with predicate');
        assert.equal(linkedList.single(simpleNumericPredicate), 5, 'Test "single" in a LinkedList with predicate');
        assert.equal(hashSet.single(simpleNumericPredicate), 5, 'Test "single" in a HashSet with predicate');
        assert.equal(stack.single(simpleNumericPredicate), 5, 'Test "single" in a Stack with predicate');
        assert.equal(queue.single(simpleNumericPredicate), 5, 'Test "single" in a Queue with predicate');
        assert.equal(set.single(simpleNumericPredicate), 5, 'Test "single" in a Set with predicate');
        assert.equal(map.single(function (t) {
            return t[0] > 4;
        })[0], 5, 'Test "single" in a Map with predicate');

        assert.equal(dictionary.single(function (t) {
            return t.key > 4;
        }).key, 5, 'Test "single" in a Dictionary with predicate');

        assert.equal(lookup.single(function (t) {
            return t.key > 4;
        }).key, 5, 'Test "single" in a Lookup with predicate');

        assert.equal(sortedList.single(function (t) {
            return t.key > 4;
        }).key, 5, 'Test "single" in a SortedList with predicate');
    });


    qtest('single method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([]).single();
        }, 'no element');

        assert.throws(function () {
            mx__default['default']([1]).single(simpleNumericPredicate);
        }, 'no match');

        assert.throws(function () {
            mx__default['default']([1, 2]).single();
        }, 'more than one element');

        assert.throws(function () {
            mx__default['default']([5, 6]).single(simpleNumericPredicate);
        }, 'more than one match');

        assert.throws(function () {
            mx__default['default']([1]).single(1);
        }, 'non-function predicate');
    });

})));

