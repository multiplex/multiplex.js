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

qmodule('linq-of-type');

qtest('basic "of-type" test', function (assert) {
    assert.equal(mx(array).ofType(Number).count(), array.length, 'ofType Number in an array of numbers');
    assert.equal(mx(array).ofType(String).count(), 0, 'ofType String in an array of numbers');
    assert.equal(mx('string').ofType(String).count(), 'string'.length, 'ofType String in an array of String');
    assert.equal(mx('string').ofType(Number).count(), 0, 'ofType Number in an array of numbers');
});

qtest('collections "of-type" method tests', function (assert) {
    var len = array.length;
    assert.equal(mx(array).ofType(Number).count(), len, 'Test toList in an array');
    assert.equal(enumerable.ofType(Number).count(), len, 'Test toList in an enumerable');
    assert.equal(collection.ofType(Number).count(), len, 'Test toList in a Collection');
    assert.equal(list.ofType(Number).count(), len, 'Test toList in a List');
    assert.equal(readOnlyCollection.ofType(Number).count(), len, 'Test toList in a ReadOnlyCollection');
    assert.equal(linkedList.ofType(Number).count(), len, 'Test toList in a LinkedList');
    assert.equal(hashSet.ofType(Number).count(), len, 'Test toList in a HashSet');
    assert.equal(stack.ofType(Number).count(), len, 'Test toList in a Stack');
    assert.equal(queue.ofType(Number).count(), len, 'Test toList in a Queue');
});

})));

