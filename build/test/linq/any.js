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

qmodule('linq-any');


function simpleNumericPredicate(t) {
    return t < 10;
}

qtest('basic any test', function (assert) {
    assert.ok(mx(array).any(simpleNumericPredicate), 'Test any numbers in an array are less than 10');

    assert.ok(!mx(array).any(function (t) {
        return t > 10;
    }), 'Test any numbers in an array are greater than 10');

    assert.ok(mx([1]).any(), 'Test any without predicate over non empty iterable results true');
    assert.ok(!mx([]).any(simpleNumericPredicate), 'Test any over an empty iterable results false');
});


qtest('collections any method tests', function (assert) {
    assert.ok(mx(collection).any(), 'Test any item in a Collection');
    assert.ok(mx(collection).any(simpleNumericPredicate), 'Test any numbers in a Collection are less than 10');

    assert.ok(mx(list).any(), 'Test any item in a List');
    assert.ok(mx(list).any(simpleNumericPredicate), 'Test any numbers in a List are less than 10');

    assert.ok(mx(readOnlyCollection).any(), 'Test any item in a ReadOnlyCollection');
    assert.ok(mx(readOnlyCollection).any(simpleNumericPredicate), 'Test any numbers in a ReadOnlyCollection are less than 10');

    assert.ok(mx(linkedList).any(), 'Test any item in a LinkedList');
    assert.ok(mx(linkedList).any(simpleNumericPredicate), 'Test any numbers in a LinkedList are less than 10');

    assert.ok(mx(hashSet).any(), 'Test any item in a HashSet');
    assert.ok(mx(hashSet).any(simpleNumericPredicate), 'Test any numbers in a HashSet are less than 10');

    assert.ok(mx(stack).any(), 'Test any item in a Stack');
    assert.ok(mx(stack).any(simpleNumericPredicate), 'Test any numbers in a Stack are less than 10');

    assert.ok(mx(queue).any(), 'Test any item in a Queue');
    assert.ok(mx(queue).any(simpleNumericPredicate), 'Test any numbers in a Queue are less than 10');

    assert.ok(mx(set).any(), 'Test any item in a Set');
    assert.ok(mx(set).any(simpleNumericPredicate), 'Test any numbers in a Set are less than 10');

    assert.ok(mx(map).any(), 'Test any item in a Map');
    assert.ok(mx(map).any(function (t) {
        return t[0] < 10;
    }), 'Test any numbers in a Map are less than 10');

    assert.ok(mx(dictionary).any(), 'Test any item in a Dictionary');
    assert.ok(mx(dictionary).any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a Dictionary are less than 10');

    assert.ok(mx(lookup).any(), 'Test any item in a Lookup');
    assert.ok(mx(lookup).any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a Lookup are less than 10');

    assert.ok(mx(sortedList).any(), 'Test any item in a SortedList');
    assert.ok(mx(sortedList).any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a SortedList are less than 10');
});


qtest('any method validations', function (assert) {
    assert.throws(function () {
        mx([1]).all([2], 1);
    }, 'non-function predicate');
});

})));

