(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var array = [1, 2, 3, 4, 5];
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

qmodule('linq-element-at');

qtest('basic "element-at" test', function (assert) {
    assert.equal(mx(array).elementAt(0), 1, 'first element of an array of numbers');
    assert.equal(mx(array).elementAt(4), 5, 'last element of an array of numbers');
});



qtest('collections "element-at" method tests', function (assert) {
    assert.equal(collection.elementAt(0), 1, 'first element in a Collection');
    assert.equal(collection.elementAt(4), 5, 'last element in a Collection');

    assert.equal(list.elementAt(0), 1, 'first element in a List');
    assert.equal(list.elementAt(4), 5, 'last element in a List');

    assert.equal(readOnlyCollection.elementAt(0), 1, 'first element in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.elementAt(4), 5, 'last element in a ReadOnlyCollection');

    assert.equal(linkedList.elementAt(0), 1, 'first element in a LinkedList');
    assert.equal(linkedList.elementAt(4), 5, 'last element in a LinkedList');

    assert.equal(hashSet.elementAt(0), 1, 'first element in a HashSet');
    assert.equal(hashSet.elementAt(4), 5, 'last element in a HashSet');

    assert.equal(stack.elementAt(0), 1, 'first element in a Stack');
    assert.equal(stack.elementAt(4), 5, 'last element in a Stack');

    assert.equal(queue.elementAt(0), 1, 'first element in a Queue');
    assert.equal(queue.elementAt(4), 5, 'last element in a Queue');

    assert.equal(set.elementAt(0), 1, 'first element in a Set');
    assert.equal(set.elementAt(4), 5, 'last element in a Set');

    assert.equal(map.elementAt(0)[0], 1, 'first element in a Map');
    assert.equal(map.elementAt(4)[0], 5, 'last element in a Map');

    assert.equal(dictionary.elementAt(0).key, 1, 'first element in a Dictionary');
    assert.equal(dictionary.elementAt(4).key, 5, 'last element in a Dictionary');

    assert.equal(lookup.elementAt(0).key, 1, 'first element in a Lookup');
    assert.equal(lookup.elementAt(4).key, 5, 'last element in a Lookup');

    assert.equal(sortedList.elementAt(0).key, 1, 'first element in a SortedList');
    assert.equal(sortedList.elementAt(4).key, 5, 'last element in a SortedList');
});



qtest('"element-at" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).elementAt();
    }, 'null index');

    assert.throws(function () {
        mx([1]).elementAt(true);
    }, 'non-numeric index');

    assert.throws(function () {
        mx([1]).elementAt(-1);
    }, 'negative index');

    assert.throws(function () {
        mx([]).elementAt(0);
    }, 'empty iterable index');

    assert.throws(function () {
        mx([1]).elementAt(2);
    }, 'index out of range');
});

})));

