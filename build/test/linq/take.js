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

qmodule('linq-take');



qtest('basic take test', function (assert) {
    assert.equal(mx(array).take(2).count(), 2, 'Test take in an array');
    assert.equal(mx([]).take(2).count(), 0, 'Test take empty array');
    assert.equal(mx(array).take(10).count(), array.length, 'Test take more than array size');
    assert.equal(mx(array).take(-10).count(), 0, 'Test take negative number');

    assert.deepEqual(mx([1, 2, 3, 4]).take(2).toArray(), [1, 2], 'Test take values on array');
    assert.deepEqual(mx.range(1, 4).take(2).toArray(), [1, 2], 'Test take values on array');
});


qtest('collections take method tests', function (assert) {
    var count = 2;
    assert.equal(mx(enumerable).take(count).count(), count, 'Test take numbers in an enumerable are less than 10');
    assert.equal(collection.take(count).count(), count, 'Test take numbers in a Collection are less than 10');
    assert.equal(list.take(count).count(), count, 'Test take numbers in a List are less than 10');
    assert.equal(readOnlyCollection.take(count).count(), count, 'Test take numbers in a ReadOnlyCollection are less than 10');
    assert.equal(linkedList.take(count).count(), count, 'Test take numbers in a LinkedList are less than 10');
    assert.equal(hashSet.take(count).count(), count, 'Test take numbers in a HashSet are less than 10');
    assert.equal(stack.take(count).count(), count, 'Test take numbers in a Stack are less than 10');
    assert.equal(queue.take(count).count(), count, 'Test take numbers in a Queue are less than 10');
    assert.equal(set.take(count).count(), count, 'Test take numbers in a Set are less than 10');
    assert.equal(map.take(count).count(), count, 'Test take numbers in a Map are less than 10');
    assert.equal(dictionary.take(count).count(), count, 'Test take numbers in a Dictionary are less than 10');
    assert.equal(lookup.take(count).count(), count, 'Test take numbers in a Lookup are less than 10');
    assert.equal(sortedList.take(count).count(), count, 'Test take numbers in a SortedList are less than 10');
});


qtest('take method validations', function (assert) {
    assert.throws(function () {
        mx([1]).take('a');
    }, 'non number count');
});

})));

