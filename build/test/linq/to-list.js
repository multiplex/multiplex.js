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

qmodule('linq-to-list');

qtest('collections to-list method tests', function (assert) {
    var len = array.length;
    assert.equal(mx(array).toList().count(), len, 'Test toList in an array');
    assert.equal(enumerable.toList().count(), len, 'Test toList in an enumerable');
    assert.equal(collection.toList().count(), len, 'Test toList in a Collection');
    assert.equal(list.toList().count(), len, 'Test toList in a List');
    assert.equal(readOnlyCollection.toList().count(), len, 'Test toList in a ReadOnlyCollection');
    assert.equal(linkedList.toList().count(), len, 'Test toList in a LinkedList');
    assert.equal(hashSet.toList().count(), len, 'Test toList in a HashSet');
    assert.equal(stack.toList().count(), len, 'Test toList in a Stack');
    assert.equal(queue.toList().count(), len, 'Test toList in a Queue');
    assert.equal(set.toList().count(), len, 'Test toList in a Set');
    assert.equal(map.toList().count(), len, 'Test toList in a Map');
    assert.equal(dictionary.toList().count(), len, 'Test toList in a Dictionary');
    assert.equal(lookup.toList().count(), len, 'Test toList in a Lookup');
    assert.equal(sortedList.toList().count(), len, 'Test toList in a SortedList');
});

})));

