(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var array = [1, 2, 3, 4, 5];
var enumerable = mx.range(1, 5);
var collection = new mx.Collection(array);
var list = new mx.List(array);
var linkedList = new mx.LinkedList(array);
var hashSet = new mx.HashSet(array);
var stack = new mx.Stack(array);
var queue = new mx.Queue(array);
var set = new mx.Set(array);
var map = new mx.Map();
var dictionary = new mx.Dictionary();
var sortedList = new mx.SortedList();
var readOnlyCollection = list.asReadOnly();
var lookup = new mx.Lookup(array, function (t) {
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

qmodule('linq-max');

function double(t) {
    return t * 2;
}

qtest('basic "max" test', function (assert) {
    assert.equal(mx(array).max(), 5, 'max element of an array of numbers');
    assert.equal(mx(array).max(double), 10, 'max element of an array of numbers with selector');

    assert.equal(mx('test').max(), 't', 'max element of an array of strings');
    assert.equal(mx([true, false, true]).max(), true, 'max element of an array of boolean');
    assert.equal(mx([new Date(2017, 1, 1), new Date(2018, 1, 1), new Date(2016, 1, 1)]).max().getFullYear(), 2018, 'max element of an array of dates');

    function cmp(b) {
        return this.val - b.val;
    }

    function valueOf() {
        return this.val;
    }

    var data1 = [
        { val: 2, __cmp__: cmp },
        { val: 3, __cmp__: cmp },
        { val: 1, __cmp__: cmp }
    ];

    var data2 = [
        { val: 2, valueOf: valueOf },
        { val: 3, valueOf: valueOf },
        { val: 1, valueOf: valueOf }
    ];

    assert.equal(mx(data1).max().val, 3, 'max element of an array of objects with __cmp__ method');
    assert.equal(mx(data2).max().val, 3, 'max element of an array of objects with valueOf method');
});



qtest('collections "max" method tests', function (assert) {
    assert.equal(enumerable.max(), 5, 'max element in an enumerable');
    assert.equal(enumerable.max(double), 10, 'max element in an enumerable with predicate');

    assert.equal(collection.max(), 5, 'max element in a Collection');
    assert.equal(collection.max(double), 10, 'max element in a Collection with predicate');

    assert.equal(list.max(), 5, 'max element in a List');
    assert.equal(list.max(double), 10, 'max element in a List with predicate');

    assert.equal(readOnlyCollection.max(), 5, 'max element in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.max(double), 10, 'max element in a ReadOnlyCollection with predicate');

    assert.equal(linkedList.max(), 5, 'max element in a LinkedList');
    assert.equal(linkedList.max(double), 10, 'max element in a LinkedList with predicate');

    assert.equal(hashSet.max(), 5, 'max element in a HashSet');
    assert.equal(hashSet.max(double), 10, 'max element in a HashSet with predicate');

    assert.equal(stack.max(), 5, 'max element in a Stack');
    assert.equal(stack.max(double), 10, 'max element in a Stack with predicate');

    assert.equal(queue.max(), 5, 'max element in a Queue');
    assert.equal(queue.max(double), 10, 'max element in a Queue with predicate');

    assert.equal(set.max(), 5, 'max element in a Set');
    assert.equal(set.max(double), 10, 'max element in a Set with predicate');

    assert.equal(map.max(function (t) {
        return t[0];
    }), 5, 'max element in a Map');

    assert.equal(dictionary.max(function (t) {
        return t.key;
    }), 5, 'max element in a Dictionary');

    assert.equal(lookup.max(function (t) {
        return t.key;
    }), 5, 'max element in a Lookup');

    assert.equal(sortedList.max(function (t) {
        return t.key;
    }), 5, 'max element in a SortedList');
});



qtest('"max" method validations', function (assert) {
    assert.throws(function () {
        mx([]).max();
    }, 'empty collection');

    assert.throws(function () {
        mx([1]).max(1);
    }, 'non function selector');
});

})));

