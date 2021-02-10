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
    new mx__default['default'].Set(array);
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

    qmodule('linq-for-each');

    function accumulateTest(source, selector) {
        var sum = 0;

        mx__default['default'](source).forEach(function (item) {
            sum += (selector ? selector(item) : item);
        });

        return sum === mx__default['default'](source).sum(selector);
    }

    function indexTest(source) {
        var res = true;
        var i = 0;

        mx__default['default'](source).forEach(function (item, index) {
            res = res & (i === index);
            i++;
        });

        return res;
    }


    qtest('basic "forEach" test', function (assert) {
        assert.ok(accumulateTest(array), 'Test forEach on a array of numbers');
        assert.ok(indexTest(array), 'Test forEach index on a array of numbers');

        var res, thisArg = {};
        mx__default['default']([1]).forEach(function () {
            res = (this === thisArg);
        }, thisArg);

        assert.ok(res, 'Test forEach thisArg');
    });


    qtest('collections "forEach" method tests', function (assert) {
        assert.ok(accumulateTest(enumerable), 'Test forEach in an enumerable');
        assert.ok(indexTest(enumerable), 'Test forEach index in an enumerable');

        assert.ok(accumulateTest(collection), 'Test forEach in a Collection');
        assert.ok(indexTest(collection), 'Test forEach index in a Collection');

        assert.ok(accumulateTest(list), 'Test forEach in a List');
        assert.ok(indexTest(list), 'Test forEach index in a List');

        assert.ok(accumulateTest(readOnlyCollection), 'Test forEach in a ReadOnlyCollection');
        assert.ok(indexTest(readOnlyCollection), 'Test forEach index in a ReadOnlyCollection');

        assert.ok(accumulateTest(linkedList), 'Test forEach in a LinkedList');
        assert.ok(indexTest(linkedList), 'Test forEach index in a LinkedList');

        assert.ok(accumulateTest(hashSet), 'Test forEach in a HashSet');
        assert.ok(indexTest(hashSet), 'Test forEach index in a HashSet');

        assert.ok(accumulateTest(stack), 'Test forEach in a Stack');
        assert.ok(indexTest(stack), 'Test forEach index in a Stack');

        assert.ok(accumulateTest(queue), 'Test forEach in a Queue');
        assert.ok(indexTest(queue), 'Test forEach index in a Queue');

        assert.ok(accumulateTest(dictionary, function (t) {
            return t.key;
        }), 'Test forEach in a Dictionary');
        assert.ok(indexTest(dictionary), 'Test forEach index in a Dictionary');

        assert.ok(accumulateTest(lookup, function (t) {
            return t.key;
        }), 'Test forEach in a Lookup');
        assert.ok(indexTest(lookup), 'Test forEach index in a Lookup');

        assert.ok(accumulateTest(sortedList, function (t) {
            return t.key;
        }), 'Test forEach in a SortedList');
        assert.ok(indexTest(sortedList), 'Test forEach index in a SortedList');
    });

})));

