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

    qmodule('linq-last');

    function simpleNumericPredicate(t) {
        return t <= 4;
    }


    qtest('basic "last" test', function (assert) {
        assert.equal(mx__default['default'](array).last(), 5, 'last of an array of numbers');
        assert.equal(mx__default['default'](array).last(simpleNumericPredicate), 4, 'last of an array of numbers with predicate');
        assert.equal(mx__default['default']('string').last(), 'g', 'last of an string');
    });


    qtest('collections "last" method tests', function (assert) {
        assert.equal(enumerable.last(), 5, 'Test "last" in an enumerable');
        assert.equal(enumerable.last(simpleNumericPredicate), 4, 'Test "last" in an enumerable with predicate');

        assert.equal(collection.last(), 5, 'Test "last" in a Collection');
        assert.equal(collection.last(simpleNumericPredicate), 4, 'Test "last" in a Collection with predicate');

        assert.equal(list.last(), 5, 'Test "last" in a List');
        assert.equal(list.last(simpleNumericPredicate), 4, 'Test "last" in a List with predicate');

        assert.equal(readOnlyCollection.last(), 5, 'Test "last" in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.last(simpleNumericPredicate), 4, 'Test "last" in a ReadOnlyCollection with predicate');

        assert.equal(linkedList.last(), 5, 'Test "last" in a LinkedList');
        assert.equal(linkedList.last(simpleNumericPredicate), 4, 'Test "last" in a LinkedList with predicate');

        assert.equal(hashSet.last(), 5, 'Test "last" in a HashSet');
        assert.equal(hashSet.last(simpleNumericPredicate), 4, 'Test "last" in a HashSet with predicate');

        assert.equal(stack.last(), 5, 'Test "last" in a Stack');
        assert.equal(stack.last(simpleNumericPredicate), 4, 'Test "last" in a Stack with predicate');

        assert.equal(queue.last(), 5, 'Test "last" in a Queue');
        assert.equal(queue.last(simpleNumericPredicate), 4, 'Test "last" in a Queue with predicate');

        assert.equal(set.last(), 5, 'Test "last" in a Set');
        assert.equal(set.last(simpleNumericPredicate), 4, 'Test "last" in a Set with predicate');

        assert.equal(map.last()[0], 5, 'Test "last" in a Map');
        assert.equal(map.last(function (t) {
            return t[0] <= 4;
        })[0], 4, 'Test "last" in a Map with predicate');

        assert.equal(dictionary.last().key, 5, 'Test "last" in a Dictionary');
        assert.equal(dictionary.last(function (t) {
            return t.key <= 4;
        }).key, 4, 'Test "last" in a Dictionary with predicate');

        assert.equal(lookup.last().key, 5, 'Test "last" in a Lookup');
        assert.equal(lookup.last(function (t) {
            return t.key <= 4;
        }).key, 4, 'Test "last" in a Lookup with predicate');

        assert.equal(sortedList.last().key, 5, 'Test "last" in a SortedList');
        assert.equal(sortedList.last(function (t) {
            return t.key <= 4;
        }).key, 4, 'Test "last" in a SortedList with predicate');
    });


    qtest('last method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([]).last();
        }, 'empty collection');

        assert.throws(function () {
            mx__default['default']([5]).last(5);
        }, 'non-function predicate');

        assert.throws(function () {
            mx__default['default']([5]).last(simpleNumericPredicate);
        }, 'no match');
    });

})));

