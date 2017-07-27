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

qmodule('linq-skip');



qtest('basic skip test', function (assert) {
    assert.equal(mx(array).skip(2).count(), array.length - 2, 'Test skip in an array');
    assert.equal(mx([]).skip(2).count(), 0, 'Test skip empty array');
    assert.equal(mx(array).skip(10).count(), 0, 'Test skip more than array size');
    assert.equal(mx(array).skip(-10).count(), array.length, 'Test skip negative number');

    assert.deepEqual(mx([1, 2, 3, 4]).skip(2).toArray(), [3, 4], 'Test skip values on array');
    assert.deepEqual(mx.range(1, 4).skip(2).toArray(), [3, 4], 'Test skip values on array');
});


qtest('collections skip method tests', function (assert) {
    var count = 2;
    var len = array.length - 2;
    assert.equal(mx(enumerable).skip(count).count(), len, 'Test skip numbers in an enumerable are less than 10');
    assert.equal(collection.skip(count).count(), len, 'Test skip numbers in a Collection are less than 10');
    assert.equal(list.skip(count).count(), len, 'Test skip numbers in a List are less than 10');
    assert.equal(readOnlyCollection.skip(count).count(), len, 'Test skip numbers in a ReadOnlyCollection are less than 10');
    assert.equal(linkedList.skip(count).count(), len, 'Test skip numbers in a LinkedList are less than 10');
    assert.equal(hashSet.skip(count).count(), len, 'Test skip numbers in a HashSet are less than 10');
    assert.equal(stack.skip(count).count(), len, 'Test skip numbers in a Stack are less than 10');
    assert.equal(queue.skip(count).count(), len, 'Test skip numbers in a Queue are less than 10');
    assert.equal(set.skip(count).count(), len, 'Test skip numbers in a Set are less than 10');
    assert.equal(map.skip(count).count(), len, 'Test skip numbers in a Map are less than 10');
    assert.equal(dictionary.skip(count).count(), len, 'Test skip numbers in a Dictionary are less than 10');
    assert.equal(lookup.skip(count).count(), len, 'Test skip numbers in a Lookup are less than 10');
    assert.equal(sortedList.skip(count).count(), len, 'Test skip numbers in a SortedList are less than 10');
});


qtest('skip method validations', function (assert) {
    assert.throws(function () {
        mx([1]).skip('a');
    }, 'non number count');
});

})));

