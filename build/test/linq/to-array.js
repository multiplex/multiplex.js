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

qmodule('linq-to-array');

qtest('collections to-array method tests', function (assert) {
    var len = array.length;
    assert.equal(mx(array).toArray().length, len, 'Test toArray in an array');
    assert.equal(enumerable.toArray().length, len, 'Test toArray in an array');
    assert.equal(collection.toArray().length, len, 'Test toArray in a Collection');
    assert.equal(list.toArray().length, len, 'Test toArray in a List');
    assert.equal(readOnlyCollection.toArray().length, len, 'Test toArray in a ReadOnlyCollection');
    assert.equal(linkedList.toArray().length, len, 'Test toArray in a LinkedList');
    assert.equal(hashSet.toArray().length, len, 'Test toArray in a HashSet');
    assert.equal(stack.toArray().length, len, 'Test toArray in a Stack');
    assert.equal(queue.toArray().length, len, 'Test toArray in a Queue');
    assert.equal(set.toArray().length, len, 'Test toArray in a Set');
    assert.equal(map.toArray().length, len, 'Test toArray in a Map');
    assert.equal(dictionary.toArray().length, len, 'Test toArray in a Dictionary');
    assert.equal(lookup.toArray().length, len, 'Test toArray in a Lookup');
    assert.equal(sortedList.toArray().length, len, 'Test toArray in a SortedList');

    assert.deepEqual(mx(array).toArray(), array, 'Test toArray in an array');
    assert.deepEqual(enumerable.toArray(), array, 'Test toArray in an array');
    assert.deepEqual(collection.toArray(), array, 'Test toArray in a Collection');
    assert.deepEqual(list.toArray(), array, 'Test toArray in a List');
    assert.deepEqual(readOnlyCollection.toArray(), array, 'Test toArray in a ReadOnlyCollection');
    assert.deepEqual(linkedList.toArray(), array, 'Test toArray in a LinkedList');
    assert.deepEqual(hashSet.toArray(), array, 'Test toArray in a HashSet');
    assert.deepEqual(stack.toArray(), array, 'Test toArray in a Stack');
    assert.deepEqual(queue.toArray(), array, 'Test toArray in a Queue');
    assert.deepEqual(set.toArray(), array, 'Test toArray in a Set');
});

})));

