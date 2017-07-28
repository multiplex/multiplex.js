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

for (var i$1 = 0; i$1 < array.length; i$1++) {
    map.set(array[i$1], array[i$1]);
    dictionary.set(array[i$1], array[i$1]);
    sortedList.add(array[i$1], array[i$1]);
}

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('linq-select');


function double(t) {
    return t * 2;
}

var result = new Array(array.length);
for (var i = 0; i < array.length; i++) {
    result[i] = double(array[i]);
}

qtest('basic select test', function (assert) {
    assert.equal(mx(array).select(double).count(), array.length, 'Test select numbers in an array are less than 10');
    assert.equal(mx(enumerable).select(double).count(), array.length, 'Test select numbers in an enumerable are less than 10');

    var total = 10;
    var index = 0;
    mx.range(0, total).select(function (item, i) {
        index = i + 1;
    }).toArray();

    assert.equal(total, index, 'Test select callback function index argument');
});


qtest('collections select method tests', function (assert) {
    assert.deepEqual(enumerable.select(double).toArray(), result, 'Test select numbers in an enumerable are less than 10');
    assert.deepEqual(collection.select(double).toArray(), result, 'Test select numbers in a Collection are less than 10');
    assert.deepEqual(list.select(double).toArray(), result, 'Test select numbers in a List are less than 10');
    assert.deepEqual(readOnlyCollection.select(double).toArray(), result, 'Test select numbers in a ReadOnlyCollection are less than 10');
    assert.deepEqual(linkedList.select(double).toArray(), result, 'Test select numbers in a LinkedList are less than 10');
    assert.deepEqual(hashSet.select(double).toArray(), result, 'Test select numbers in a HashSet are less than 10');
    assert.deepEqual(stack.select(double).toArray(), result, 'Test select numbers in a Stack are less than 10');
    assert.deepEqual(queue.select(double).toArray(), result, 'Test select numbers in a Queue are less than 10');
    assert.deepEqual(set.select(double).toArray(), result, 'Test select numbers in a Set are less than 10');

    assert.deepEqual(map.select(function (t) {
        return double(t[0]);
    }).toArray(), result, 'Test select numbers in a Map are less than 10');

    assert.deepEqual(dictionary.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a Dictionary are less than 10');

    assert.deepEqual(lookup.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a Lookup are less than 10');

    assert.deepEqual(sortedList.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a SortedList are less than 10');
});


qtest('select method validations', function (assert) {
    assert.throws(function () {
        mx([1]).select();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).select(1);
    }, 'non-function predicate');
});

})));

