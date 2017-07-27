(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
	typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
	(factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = mx && mx.hasOwnProperty('default') ? mx['default'] : mx;

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

var qunit$1 = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit$1.module;
var qtest = qunit$1.test;

qmodule('linq-sum');

function double(t) {
    return t * 2;
}

function calcsum(items, selector) {
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        sum += (selector ? selector(items[i]) : items[i]);
    }

    return sum;
}

qtest('basic "sum" test', function (assert) {
    assert.equal(mx(array).sum(), calcsum(array), 'sum element of an array of numbers');
    assert.equal(mx(array).sum(double), calcsum(array, double), 'sum element of an array of numbers with selector');
    assert.equal(mx([]).sum(), 0, 'sum of empty array');
    assert.equal(mx([]).sum(double), 0, 'sum of empty array with selector');
});



qtest('collections "sum" method tests', function (assert) {
    var s1 = calcsum(array);
    var s2 = calcsum(array, double);

    assert.equal(enumerable.sum(), s1, 'sum element in an enumerable');
    assert.equal(enumerable.sum(double), s2, 'sum element in an enumerable with predicate');

    assert.equal(collection.sum(), s1, 'sum element in a Collection');
    assert.equal(collection.sum(double), s2, 'sum element in a Collection with predicate');

    assert.equal(list.sum(), s1, 'sum element in a List');
    assert.equal(list.sum(double), s2, 'sum element in a List with predicate');

    assert.equal(readOnlyCollection.sum(), s1, 'sum element in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.sum(double), s2, 'sum element in a ReadOnlyCollection with predicate');

    assert.equal(linkedList.sum(), s1, 'sum element in a LinkedList');
    assert.equal(linkedList.sum(double), s2, 'sum element in a LinkedList with predicate');

    assert.equal(hashSet.sum(), s1, 'sum element in a HashSet');
    assert.equal(hashSet.sum(double), s2, 'sum element in a HashSet with predicate');

    assert.equal(stack.sum(), s1, 'sum element in a Stack');
    assert.equal(stack.sum(double), s2, 'sum element in a Stack with predicate');

    assert.equal(queue.sum(), s1, 'sum element in a Queue');
    assert.equal(queue.sum(double), s2, 'sum element in a Queue with predicate');

    assert.equal(set.sum(), s1, 'sum element in a Set');
    assert.equal(set.sum(double), s2, 'sum element in a Set with predicate');

    assert.equal(map.sum(function (t) {
        return t[0];
    }), s1, 'sum element in a Map');

    assert.equal(dictionary.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a Dictionary');

    assert.equal(lookup.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a Lookup');

    assert.equal(sortedList.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a SortedList');
});



qtest('"sum" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).sum(1);
    }, 'non function selector');

    assert.throws(function () {
        mx(['a']).sum();
    }, 'non numeric iterator');
});

})));

