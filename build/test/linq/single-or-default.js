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

qmodule('linq-single-or-default');

function simpleNumericPredicate(t) {
    return t > 5;
}


qtest('basic "singleOrDefault" test', function (assert) {
    assert.equal(mx([1]).singleOrDefault(), 1, 'singleOrDefault of an array of numbers');
    assert.equal(mx([]).singleOrDefault(), null, 'singleOrDefault of an array of numbers with default value');

    assert.equal(mx(array).singleOrDefault(simpleNumericPredicate), null, 'singleOrDefault of an array of numbers with predicate');
    assert.equal(mx(array).singleOrDefault(simpleNumericPredicate, 0), 0, 'singleOrDefault of an array of numbers with predicate and default value');

    assert.equal(mx('t').singleOrDefault(), 't', 'singleOrDefault of an string');
});


qtest('collections "singleOrDefault" method tests', function (assert) {
    assert.equal(collection.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Collection with predicate');
    assert.equal(collection.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Collection with predicate and default value');

    assert.equal(list.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a List with predicate');
    assert.equal(list.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a List with predicate and default value');

    assert.equal(readOnlyCollection.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a ReadOnlyCollection with predicate');
    assert.equal(readOnlyCollection.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a ReadOnlyCollection with predicate and default value');

    assert.equal(linkedList.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a LinkedList with predicate');
    assert.equal(linkedList.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a LinkedList with predicate and default value');

    assert.equal(hashSet.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a HashSet with predicate');
    assert.equal(hashSet.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a HashSet with predicate and default value');

    assert.equal(stack.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Stack with predicate');
    assert.equal(stack.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Stack with predicate and default value');

    assert.equal(queue.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Queue with predicate');
    assert.equal(set.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Set with predicate and default value');

    assert.equal(map.singleOrDefault(function (t) {
        return t[0] > 5;
    }), null, 'Test "singleOrDefault" in a Map with predicate');

    assert.equal(map.singleOrDefault(function (t) {
        return t[0] > 5;
    }, 0), 0, 'Test "singleOrDefault" in a Map with predicate');

    function keyvaluepredicate(t) {
        return t.key > 5;
    }

    assert.equal(dictionary.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a Dictionary with predicate');
    assert.equal(dictionary.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a Dictionary with predicate and default value');

    assert.equal(lookup.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a Lookup with predicate');
    assert.equal(lookup.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a Lookup with predicate and default value');

    assert.equal(sortedList.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a SortedList with predicate');
    assert.equal(sortedList.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a SortedList with predicate and default value');
});


qtest('single method validations', function (assert) {
    assert.throws(function () {
        mx([1, 2]).singleOrDefault();
    }, 'more than one element');

    assert.throws(function () {
        mx([6, 7]).singleOrDefault(simpleNumericPredicate);
    }, 'more than one match');

    assert.throws(function () {
        mx([1]).singleOrDefault(1);
    }, 'non-function predicate');
});

})));

