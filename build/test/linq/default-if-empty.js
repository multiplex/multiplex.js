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

qmodule('linq-default-if-empty');

qtest('basic "defaultIfEmpty" test', function (assert) {
    assert.equal(mx(array).defaultIfEmpty().count(), 5, 'defaultIfEmpty on a non-empty array');
    assert.equal(mx([]).defaultIfEmpty(1).toArray()[0], 1, 'defaultIfEmpty on an empty array');
});

qtest('collections "defaultIfEmpty" method tests', function (assert) {
    assert.equal(collection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Collection');
    assert.equal(new mx.Collection().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Collection');

    assert.equal(list.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a List');
    assert.equal(new mx.List().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty List');

    assert.equal(readOnlyCollection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a ReadOnlyCollection');
    assert.equal(new mx.ReadOnlyCollection([]).defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty ReadOnlyCollection');

    assert.equal(linkedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a LinkedList');
    assert.equal(new mx.LinkedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty LinkedList');

    assert.equal(hashSet.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a HashSet');
    assert.equal(new mx.HashSet().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty HashSet');

    assert.equal(stack.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Stack');
    assert.equal(new mx.Stack().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Stack');

    assert.equal(queue.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Queue');
    assert.equal(new mx.Queue().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Queue');

    assert.equal(set.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Set');
    assert.equal(new mx.Set().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Set');

    assert.equal(map.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Map');
    assert.equal(new mx.Map().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Map');

    assert.equal(dictionary.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Dictionary');
    assert.equal(lookup.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Lookup');

    assert.equal(sortedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a SortedList');
    assert.equal(new mx.SortedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty SortedList');
});

})));

