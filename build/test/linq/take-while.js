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

qmodule('linq-take-while');

var limit = 3;
var count = limit;
function simpleNumericPredicate(t) {
    return t <= limit;
}

qtest('basic "take-while" test', function (assert) {
    assert.equal(mx(array).takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in an array are less than 10');
    assert.equal(mx(enumerable).takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in an enumerable are less than 10');

    assert.equal(mx(array).takeWhile(function (t) {
        return t < 10;
    }).count(), array.length, 'Test takeWhile numbers in an array are less than 10');

    assert.equal(mx(array).takeWhile(function (t) {
        return t > 10;
    }).count(), 0, 'Test takeWhile numbers in an array are greater than 10');

    assert.equal(mx([]).takeWhile(simpleNumericPredicate).count(), 0, 'Test takeWhile over an empty iterable results false');
});


qtest('collections "take-while" method tests', function (assert) {
    assert.equal(collection.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Collection are less than 10');
    assert.equal(list.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a List are less than 10');
    assert.equal(readOnlyCollection.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a ReadOnlyCollection are less than 10');
    assert.equal(linkedList.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a LinkedList are less than 10');
    assert.equal(hashSet.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a HashSet are less than 10');
    assert.equal(stack.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Stack are less than 10');
    assert.equal(queue.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Queue are less than 10');
    assert.equal(set.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Set are less than 10');

    assert.equal(map.takeWhile(function (t) {
        return t[0] <= limit;
    }).count(), count, 'Test takeWhile numbers in a Map are less than 10');

    assert.equal(dictionary.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a Dictionary are less than 10');

    assert.equal(lookup.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a Lookup are less than 10');

    assert.equal(sortedList.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a SortedList are less than 10');
});


qtest('"take-while" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).takeWhile();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).takeWhile(1);
    }, 'non-function predicate');
});

})));

