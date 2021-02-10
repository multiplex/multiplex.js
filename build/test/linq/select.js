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

    qmodule('linq-select');


    function double(t) {
        return t * 2;
    }

    var result = new Array(array.length);
    for (var i$1 = 0; i$1 < array.length; i$1++) {
        result[i$1] = double(array[i$1]);
    }

    qtest('basic select test', function (assert) {
        assert.equal(mx__default['default'](array).select(double).count(), array.length, 'Test select numbers in an array are less than 10');
        assert.equal(mx__default['default'](enumerable).select(double).count(), array.length, 'Test select numbers in an enumerable are less than 10');

        var total = 10;
        var index = 0;
        mx__default['default'].range(0, total).select(function (item, i) {
            index = i + 1;
        }).toArray();

        assert.equal(total, index, 'Test select callback function index argument');
    });


    qtest('collections select method tests', function (assert) {
        assert.deepEqual(enumerable.select(double).toArray(), result, 'Test select numbers in an enumerable are less than 10');
        assert.deepEqual(collection.select(double).toArray(), result, 'Test select numbers in a Collection are less than 10');
        assert.deepEqual(list.select(double).toArray(), result, 'Test select numbers in a List are less than 10');
        assert.deepEqual(readOnlyCollection.select(double).toArray(), result, 'Test select numbers in a ReadOnlyCollection are less than 10');
        assert.deepEqual(linkedList.select(double).toArray(), result, 'Test select numbers in a LinkedList are less than 10');
        assert.deepEqual(hashSet.select(double).toArray(), result, 'Test select numbers in a HashSet are less than 10');
        assert.deepEqual(stack.select(double).toArray(), result, 'Test select numbers in a Stack are less than 10');
        assert.deepEqual(queue.select(double).toArray(), result, 'Test select numbers in a Queue are less than 10');
        assert.deepEqual(set.select(double).toArray(), result, 'Test select numbers in a Set are less than 10');

        assert.deepEqual(map.select(function (t) {
            return double(t[0]);
        }).toArray(), result, 'Test select numbers in a Map are less than 10');

        assert.deepEqual(dictionary.select(function (t) {
            return double(t.key);
        }).toArray(), result, 'Test select numbers in a Dictionary are less than 10');

        assert.deepEqual(lookup.select(function (t) {
            return double(t.key);
        }).toArray(), result, 'Test select numbers in a Lookup are less than 10');

        assert.deepEqual(sortedList.select(function (t) {
            return double(t.key);
        }).toArray(), result, 'Test select numbers in a SortedList are less than 10');
    });


    qtest('select method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).select();
        }, 'without predicate');

        assert.throws(function () {
            mx__default['default']([1]).select(1);
        }, 'non-function predicate');
    });

})));

