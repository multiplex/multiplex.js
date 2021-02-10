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

    qmodule('linq-first');

    function simpleNumericPredicate(t) {
        return t > 3;
    }


    qtest('basic "first" test', function (assert) {
        assert.equal(mx__default['default'](array).first(), 1, 'first of an array of numbers');
        assert.equal(mx__default['default'](array).first(simpleNumericPredicate), 4, 'first of an array of numbers with predicate');
        assert.equal(mx__default['default']('test').first(), 't', 'first of an string');
    });


    qtest('collections "first" method tests', function (assert) {
        assert.equal(enumerable.first(), 1, 'Test "first" in an enumerable');
        assert.equal(enumerable.first(simpleNumericPredicate), 4, 'Test "first" in an enumerable with predicate');

        assert.equal(collection.first(), 1, 'Test "first" in a Collection');
        assert.equal(collection.first(simpleNumericPredicate), 4, 'Test "first" in a Collection with predicate');

        assert.equal(list.first(), 1, 'Test "first" in a List');
        assert.equal(list.first(simpleNumericPredicate), 4, 'Test "first" in a List with predicate');

        assert.equal(readOnlyCollection.first(), 1, 'Test "first" in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.first(simpleNumericPredicate), 4, 'Test "first" in a ReadOnlyCollection with predicate');

        assert.equal(linkedList.first(), 1, 'Test "first" in a LinkedList');
        assert.equal(linkedList.first(simpleNumericPredicate), 4, 'Test "first" in a LinkedList with predicate');

        assert.equal(hashSet.first(), 1, 'Test "first" in a HashSet');
        assert.equal(hashSet.first(simpleNumericPredicate), 4, 'Test "first" in a HashSet with predicate');

        assert.equal(stack.first(), 1, 'Test "first" in a Stack');
        assert.equal(stack.first(simpleNumericPredicate), 4, 'Test "first" in a Stack with predicate');

        assert.equal(queue.first(), 1, 'Test "first" in a Queue');
        assert.equal(queue.first(simpleNumericPredicate), 4, 'Test "first" in a Queue with predicate');

        assert.equal(set.first(), 1, 'Test "first" in a Set');
        assert.equal(set.first(simpleNumericPredicate), 4, 'Test "first" in a Set with predicate');

        assert.equal(map.first()[0], 1, 'Test "first" in a Map');
        assert.equal(map.first(function (t) {
            return t[0] > 3;
        })[0], 4, 'Test "first" in a Map with predicate');

        assert.equal(dictionary.first().key, 1, 'Test "first" in a Dictionary');
        assert.equal(dictionary.first(function (t) {
            return t.key > 3;
        }).key, 4, 'Test "first" in a Dictionary with predicate');

        assert.equal(lookup.first().key, 1, 'Test "first" in a Lookup');
        assert.equal(lookup.first(function (t) {
            return t.key > 3;
        }).key, 4, 'Test "first" in a Lookup with predicate');

        assert.equal(sortedList.first().key, 1, 'Test "first" in a SortedList');
        assert.equal(sortedList.first(function (t) {
            return t.key > 3;
        }).key, 4, 'Test "first" in a SortedList with predicate');
    });


    qtest('first method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([]).first();
        }, 'empty collection');

        assert.throws(function () {
            mx__default['default']([1]).first(1);
        }, 'non-function predicate');

        assert.throws(function () {
            mx__default['default']([1]).first(simpleNumericPredicate);
        }, 'no match');
    });

})));

