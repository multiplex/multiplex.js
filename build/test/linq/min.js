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

qmodule('linq-min');

function double(t) {
    return t * 2;
}

qtest('basic "min" test', function (assert) {
    assert.equal(mx(array).min(), 1, 'min element of an array of numbers');
    assert.equal(mx(array).min(double), 2, 'min element of an array of numbers with selector');

    assert.equal(mx('test').min(), 'e', 'min element of an array of strings');
    assert.equal(mx([true, false, true]).min(), false, 'min element of an array of boolean');
    assert.equal(mx([new Date(2017, 1, 1), new Date(2018, 1, 1), new Date(2016, 1, 1)]).min().getFullYear(), 2016, 'min element of an array of dates');

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

    assert.equal(mx(data1).min().val, 1, 'min element of an array of objects with __cmp__ method');
    assert.equal(mx(data2).min().val, 1, 'min element of an array of objects with valueOf method');
});



qtest('collections "min" method tests', function (assert) {
    assert.equal(collection.min(), 1, 'min element in a Collection');
    assert.equal(collection.min(double), 2, 'min element in a Collection with predicate');

    assert.equal(list.min(), 1, 'min element in a List');
    assert.equal(list.min(double), 2, 'min element in a List with predicate');

    assert.equal(readOnlyCollection.min(), 1, 'min element in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.min(double), 2, 'min element in a ReadOnlyCollection with predicate');

    assert.equal(linkedList.min(), 1, 'min element in a LinkedList');
    assert.equal(linkedList.min(double), 2, 'min element in a LinkedList with predicate');

    assert.equal(hashSet.min(), 1, 'min element in a HashSet');
    assert.equal(hashSet.min(double), 2, 'min element in a HashSet with predicate');

    assert.equal(stack.min(), 1, 'min element in a Stack');
    assert.equal(stack.min(double), 2, 'min element in a Stack with predicate');

    assert.equal(queue.min(), 1, 'min element in a Queue');
    assert.equal(queue.min(double), 2, 'min element in a Queue with predicate');

    assert.equal(set.min(), 1, 'min element in a Set');
    assert.equal(set.min(double), 2, 'min element in a Set with predicate');

    assert.equal(map.min(function (t) {
        return t[0];
    }), 1, 'min element in a Map');

    assert.equal(dictionary.min(function (t) {
        return t.key;
    }), 1, 'min element in a Dictionary');

    assert.equal(lookup.min(function (t) {
        return t.key;
    }), 1, 'min element in a Lookup');

    assert.equal(sortedList.min(function (t) {
        return t.key;
    }), 1, 'min element in a SortedList');
});



qtest('"min" method validations', function (assert) {
    assert.throws(function () {
        mx([]).min();
    }, 'empty collection');

    assert.throws(function () {
        mx([1]).min(1);
    }, 'non function selector');
});

})));

