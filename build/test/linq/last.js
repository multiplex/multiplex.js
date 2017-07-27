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

qmodule('linq-last');

function simpleNumericPredicate(t) {
    return t <= 4;
}


qtest('basic "last" test', function (assert) {
    assert.equal(mx(array).last(), 5, 'last of an array of numbers');
    assert.equal(mx(array).last(simpleNumericPredicate), 4, 'last of an array of numbers with predicate');
    assert.equal(mx('string').last(), 'g', 'last of an string');
});


qtest('collections "last" method tests', function (assert) {
    assert.equal(enumerable.last(), 5, 'Test "last" in an enumerable');
    assert.equal(enumerable.last(simpleNumericPredicate), 4, 'Test "last" in an enumerable with predicate');

    assert.equal(collection.last(), 5, 'Test "last" in a Collection');
    assert.equal(collection.last(simpleNumericPredicate), 4, 'Test "last" in a Collection with predicate');

    assert.equal(list.last(), 5, 'Test "last" in a List');
    assert.equal(list.last(simpleNumericPredicate), 4, 'Test "last" in a List with predicate');

    assert.equal(readOnlyCollection.last(), 5, 'Test "last" in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.last(simpleNumericPredicate), 4, 'Test "last" in a ReadOnlyCollection with predicate');

    assert.equal(linkedList.last(), 5, 'Test "last" in a LinkedList');
    assert.equal(linkedList.last(simpleNumericPredicate), 4, 'Test "last" in a LinkedList with predicate');

    assert.equal(hashSet.last(), 5, 'Test "last" in a HashSet');
    assert.equal(hashSet.last(simpleNumericPredicate), 4, 'Test "last" in a HashSet with predicate');

    assert.equal(stack.last(), 5, 'Test "last" in a Stack');
    assert.equal(stack.last(simpleNumericPredicate), 4, 'Test "last" in a Stack with predicate');

    assert.equal(queue.last(), 5, 'Test "last" in a Queue');
    assert.equal(queue.last(simpleNumericPredicate), 4, 'Test "last" in a Queue with predicate');

    assert.equal(set.last(), 5, 'Test "last" in a Set');
    assert.equal(set.last(simpleNumericPredicate), 4, 'Test "last" in a Set with predicate');

    assert.equal(map.last()[0], 5, 'Test "last" in a Map');
    assert.equal(map.last(function (t) {
        return t[0] <= 4;
    })[0], 4, 'Test "last" in a Map with predicate');

    assert.equal(dictionary.last().key, 5, 'Test "last" in a Dictionary');
    assert.equal(dictionary.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a Dictionary with predicate');

    assert.equal(lookup.last().key, 5, 'Test "last" in a Lookup');
    assert.equal(lookup.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a Lookup with predicate');

    assert.equal(sortedList.last().key, 5, 'Test "last" in a SortedList');
    assert.equal(sortedList.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a SortedList with predicate');
});


qtest('last method validations', function (assert) {
    assert.throws(function () {
        mx([]).last();
    }, 'empty collection');

    assert.throws(function () {
        mx([5]).last(5);
    }, 'non-function predicate');

    assert.throws(function () {
        mx([5]).last(simpleNumericPredicate);
    }, 'no match');
});

})));

