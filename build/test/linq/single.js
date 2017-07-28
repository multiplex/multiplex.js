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

qmodule('linq-single');

function simpleNumericPredicate(t) {
    return t > 4;
}


qtest('basic "single" test', function (assert) {
    assert.equal(mx([1]).single(), 1, 'single of an array of numbers');
    assert.equal(mx(array).single(simpleNumericPredicate), 5, 'single of an array of numbers with predicate');
    assert.equal(mx('t').single(), 't', 'single of an string');
});


qtest('collections "single" method tests', function (assert) {
    assert.equal(enumerable.single(simpleNumericPredicate), 5, 'Test "single" in an enumerable with predicate');
    assert.equal(collection.single(simpleNumericPredicate), 5, 'Test "single" in an Collection with predicate');
    assert.equal(list.single(simpleNumericPredicate), 5, 'Test "single" in a List with predicate');
    assert.equal(readOnlyCollection.single(simpleNumericPredicate), 5, 'Test "single" in a ReadOnlyCollection with predicate');
    assert.equal(linkedList.single(simpleNumericPredicate), 5, 'Test "single" in a LinkedList with predicate');
    assert.equal(hashSet.single(simpleNumericPredicate), 5, 'Test "single" in a HashSet with predicate');
    assert.equal(stack.single(simpleNumericPredicate), 5, 'Test "single" in a Stack with predicate');
    assert.equal(queue.single(simpleNumericPredicate), 5, 'Test "single" in a Queue with predicate');
    assert.equal(set.single(simpleNumericPredicate), 5, 'Test "single" in a Set with predicate');
    assert.equal(map.single(function (t) {
        return t[0] > 4;
    })[0], 5, 'Test "single" in a Map with predicate');

    assert.equal(dictionary.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a Dictionary with predicate');

    assert.equal(lookup.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a Lookup with predicate');

    assert.equal(sortedList.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a SortedList with predicate');
});


qtest('single method validations', function (assert) {
    assert.throws(function () {
        mx([]).single();
    }, 'no element');

    assert.throws(function () {
        mx([1]).single(simpleNumericPredicate);
    }, 'no match');

    assert.throws(function () {
        mx([1, 2]).single();
    }, 'more than one element');

    assert.throws(function () {
        mx([5, 6]).single(simpleNumericPredicate);
    }, 'more than one match');

    assert.throws(function () {
        mx([1]).single(1);
    }, 'non-function predicate');
});

})));

