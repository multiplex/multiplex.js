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

qmodule('linq-count');

function simpleNumericPredicate(t) {
    return t < 3;
}


qtest('basic "count" test', function (assert) {
    assert.equal(mx(array).count(), 5, 'count of an array');
    assert.equal(mx([]).count(), 0, 'count of an empty array');
});


qtest('collections "count" method tests', function (assert) {
    assert.equal(collection.count(), 5, 'Test "count" in a Collection');
    assert.equal(collection.count(simpleNumericPredicate), 2, 'Test "count" in a Collection with predicate');

    assert.equal(list.count(), 5, 'Test "count" in a List');
    assert.equal(list.count(simpleNumericPredicate), 2, 'Test "count" in a List with predicate');

    assert.equal(readOnlyCollection.count(), 5, 'Test "count" in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.count(simpleNumericPredicate), 2, 'Test "count" in a ReadOnlyCollection with predicate');

    assert.equal(linkedList.count(), 5, 'Test "count" in a LinkedList');
    assert.equal(linkedList.count(simpleNumericPredicate), 2, 'Test "count" in a LinkedList with predicate');

    assert.equal(hashSet.count(), 5, 'Test "count" in a HashSet');
    assert.equal(hashSet.count(simpleNumericPredicate), 2, 'Test "count" in a HashSet with predicate');

    assert.equal(stack.count(), 5, 'Test "count" in a Stack');
    assert.equal(stack.count(simpleNumericPredicate), 2, 'Test "count" in a Stack with predicate');

    assert.equal(queue.count(), 5, 'Test "count" in a Queue');
    assert.equal(queue.count(simpleNumericPredicate), 2, 'Test "count" in a Queue with predicate');

    assert.equal(set.count(), 5, 'Test "count" in a Set');
    assert.equal(set.count(simpleNumericPredicate), 2, 'Test "count" in a Set with predicate');

    assert.equal(map.count(), 5, 'Test "count" in a Map');
    assert.equal(map.count(function (t) {
        return t[0] < 3;
    }), 2, 'Test "count" in a Map with predicate');

    assert.equal(dictionary.count(), 5, 'Test "count" in a Dictionary');
    assert.equal(dictionary.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a Dictionary with predicate');

    assert.equal(lookup.count(), 5, 'Test "count" in a Lookup');
    assert.equal(lookup.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a Lookup with predicate');

    assert.equal(sortedList.count(), 5, 'Test "count" in a SortedList');
    assert.equal(sortedList.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a SortedList with predicate');
});


qtest('count method validations', function (assert) {
    assert.throws(function () {
        mx([1]).count(1);
    }, 'non-function predicate');
});

})));

