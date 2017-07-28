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

qmodule('linq-where');


function simpleNumericPredicate(t) {
    return t < 10;
}

qtest('basic where test', function (assert) {
    assert.equal(mx(array).where(simpleNumericPredicate).count(), array.length, 'Test where numbers in an array are less than 10');
    assert.equal(mx(enumerable).where(simpleNumericPredicate).count(), array.length, 'Test where numbers in an enumerable are less than 10');

    assert.equal(mx(array).where(function (t) {
        return t > 10;
    }).count(), 0, 'Test where numbers in an array are greater than 10');

    assert.equal(mx([]).where(simpleNumericPredicate).count(), 0, 'Test where over an empty iterable results false');
});


qtest('collections where method tests', function (assert) {
    var len = array.length;
    assert.equal(collection.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Collection are less than 10');
    assert.equal(list.where(simpleNumericPredicate).count(), len, 'Test where numbers in a List are less than 10');
    assert.equal(readOnlyCollection.where(simpleNumericPredicate).count(), len, 'Test where numbers in a ReadOnlyCollection are less than 10');
    assert.equal(linkedList.where(simpleNumericPredicate).count(), len, 'Test where numbers in a LinkedList are less than 10');
    assert.equal(hashSet.where(simpleNumericPredicate).count(), len, 'Test where numbers in a HashSet are less than 10');
    assert.equal(stack.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Stack are less than 10');
    assert.equal(queue.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Queue are less than 10');
    assert.equal(set.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Set are less than 10');

    assert.equal(map.where(function (t) {
        return t[0] < 10;
    }).count(), len, 'Test where numbers in a Map are less than 10');

    assert.equal(dictionary.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a Dictionary are less than 10');

    assert.equal(lookup.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a Lookup are less than 10');

    assert.equal(sortedList.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a SortedList are less than 10');
});


qtest('where method validations', function (assert) {
    assert.throws(function () {
        mx([1]).where();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).where(1);
    }, 'non-function predicate');
});

})));

