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

qmodule('linq-first-or-default');

function simpleNumericPredicate(t) {
    return t > 100;
}


qtest('basic "firstOrDefault" test', function (assert) {
    assert.equal(mx([]).firstOrDefault(), null, 'firstOrDefault of an empty iterator');
    assert.equal(mx([]).firstOrDefault(simpleNumericPredicate, 0), 0, 'firstOrDefault of an empty iterator with default value');

    assert.equal(mx(array).firstOrDefault(), 1, 'firstOrDefault of an array of numbers');
    assert.equal(mx(array).firstOrDefault(simpleNumericPredicate), null, 'firstOrDefault of an array of numbers with predicate');
    assert.equal(mx(array).firstOrDefault(simpleNumericPredicate, 0), 0, 'firstOrDefault of an array of numbers with predicate and default value');
    assert.equal(mx('test').firstOrDefault(), 't', 'firstOrDefault of an string');
});


qtest('collections "firstOrDefault" method tests', function (assert) {
    assert.equal(collection.firstOrDefault(), 1, 'Test "firstOrDefault" in a Collection');
    assert.equal(collection.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Collection with predicate');
    assert.equal(collection.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Collection with predicate and default value');

    assert.equal(list.firstOrDefault(), 1, 'Test "firstOrDefault" in a List');
    assert.equal(list.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a List with predicate');
    assert.equal(list.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a List with predicate and default value');

    assert.equal(readOnlyCollection.firstOrDefault(), 1, 'Test "firstOrDefault" in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a ReadOnlyCollection with predicate');
    assert.equal(readOnlyCollection.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a ReadOnlyCollection with predicate and default value');

    assert.equal(linkedList.firstOrDefault(), 1, 'Test "firstOrDefault" in a LinkedList');
    assert.equal(linkedList.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a LinkedList with predicate');
    assert.equal(linkedList.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a LinkedList with predicate and default value');

    assert.equal(hashSet.firstOrDefault(), 1, 'Test "firstOrDefault" in a HashSet');
    assert.equal(hashSet.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a HashSet with predicate');
    assert.equal(hashSet.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a HashSet with predicate and default value');

    assert.equal(stack.firstOrDefault(), 1, 'Test "firstOrDefault" in a Stack');
    assert.equal(stack.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Stack with predicate');
    assert.equal(stack.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Stack with predicate and default value');

    assert.equal(queue.firstOrDefault(), 1, 'Test "firstOrDefault" in a Queue');
    assert.equal(queue.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Queue with predicate');
    assert.equal(queue.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Queue with predicate and default value');

    assert.equal(set.firstOrDefault(), 1, 'Test "firstOrDefault" in a Set');
    assert.equal(set.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Set with predicate');
    assert.equal(set.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Set with predicate and default value');

    assert.equal(map.firstOrDefault()[0], 1, 'Test "firstOrDefault" in a Map');
    assert.equal(map.firstOrDefault(function (t) {
        return t[0] > 100;
    }), null, 'Test "firstOrDefault" in a Map with predicate');
    assert.equal(map.firstOrDefault(function (t) {
        return t[0] > 100;
    }, 0), 0, 'Test "firstOrDefault" in a Map with predicate and default value');

    function keyvaluePredicate(t) {
        return t.key > 100;
    }

    assert.equal(dictionary.firstOrDefault().key, 1, 'Test "firstOrDefault" in a Dictionary');
    assert.equal(dictionary.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a Dictionary with predicate');
    assert.equal(dictionary.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a Dictionary with predicate and default value');

    assert.equal(lookup.firstOrDefault().key, 1, 'Test "firstOrDefault" in a Lookup');
    assert.equal(lookup.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a Lookup with predicate');
    assert.equal(lookup.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a Lookup with predicate and default value');

    assert.equal(sortedList.firstOrDefault().key, 1, 'Test "firstOrDefault" in a SortedList');
    assert.equal(sortedList.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a SortedList with predicate');
    assert.equal(sortedList.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a SortedList with predicate and default value');
});


qtest('firstOrDefault method validations', function (assert) {
    assert.throws(function () {
        mx([1]).firstOrDefault(1);
    }, 'non-function predicate');
});

})));

