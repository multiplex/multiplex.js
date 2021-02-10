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

    qmodule('linq-skip-while');

    var limit = 3;
    var count = array.length - limit;
    function simpleNumericPredicate(t) {
        return t <= limit;
    }

    qtest('basic "skip-while" test', function (assert) {
        assert.equal(mx__default['default'](array).skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in an array are less than 10');
        assert.equal(mx__default['default'](enumerable).skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in an enumerable are less than 10');

        assert.equal(mx__default['default'](array).skipWhile(function (t) {
            return t < 10;
        }).count(), 0, 'Test skipWhile numbers in an array are less than 10');

        assert.equal(mx__default['default'](array).skipWhile(function (t) {
            return t > 10;
        }).count(), array.length, 'Test skipWhile numbers in an array are greater than 10');

        assert.equal(mx__default['default']([]).skipWhile(simpleNumericPredicate).count(), 0, 'Test skipWhile over an empty iterable results false');
    });


    qtest('collections "skip-while" method tests', function (assert) {
        assert.equal(collection.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Collection are less than 10');
        assert.equal(list.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a List are less than 10');
        assert.equal(readOnlyCollection.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a ReadOnlyCollection are less than 10');
        assert.equal(linkedList.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a LinkedList are less than 10');
        assert.equal(hashSet.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a HashSet are less than 10');
        assert.equal(stack.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Stack are less than 10');
        assert.equal(queue.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Queue are less than 10');
        assert.equal(set.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Set are less than 10');

        assert.equal(map.skipWhile(function (t) {
            return t[0] <= limit;
        }).count(), count, 'Test skipWhile numbers in a Map are less than 10');

        assert.equal(dictionary.skipWhile(function (t) {
            return t.key <= limit;
        }).count(), count, 'Test skipWhile numbers in a Dictionary are less than 10');

        assert.equal(lookup.skipWhile(function (t) {
            return t.key <= limit;
        }).count(), count, 'Test skipWhile numbers in a Lookup are less than 10');

        assert.equal(sortedList.skipWhile(function (t) {
            return t.key <= limit;
        }).count(), count, 'Test skipWhile numbers in a SortedList are less than 10');
    });


    qtest('"skip-while" method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).skipWhile();
        }, 'without predicate');

        assert.throws(function () {
            mx__default['default']([1]).skipWhile(1);
        }, 'non-function predicate');
    });

})));

