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

qmodule('linq-all');

qtest('basic all test', function (assert) {
    assert.ok(mx(array).all(function (t) {
        return t < 10;
    }), 'Test all numbers in an array are less than 10');

    assert.ok(!mx(array).all(function (t) {
        return t < 2;
    }), 'Test all numbers in an array are less than 2');

    assert.ok(mx([]).all(function (t) {
        return t < 10;
    }), 'Test all over an empty iterable results true');
});


qtest('collections all method tests', function (assert) {
    assert.ok(mx(collection).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a Collection are less than 10');

    assert.ok(mx(list).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a List are less than 10');

    assert.ok(mx(readOnlyCollection).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a ReadOnlyCollection are less than 10');

    assert.ok(mx(linkedList).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a LinkedList are less than 10');

    assert.ok(mx(hashSet).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a HashSet are less than 10');

    assert.ok(mx(stack).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a Stack are less than 10');

    assert.ok(mx(queue).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a Queue are less than 10');

    assert.ok(mx(set).all(function (t) {
        return t < 10;
    }), 'Test all numbers in a Set are less than 10');

    assert.ok(mx(map).all(function (t) {
        return t[0] < 10;
    }), 'Test all numbers in a Map are less than 10');

    assert.ok(mx(dictionary).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a Dictionary are less than 10');

    assert.ok(mx(lookup).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a Lookup are less than 10');

    assert.ok(mx(sortedList).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a SortedList are less than 10');
});


qtest('all method validations', function (assert) {
    assert.throws(function () {
        mx([1]).all();
    }, 'null input');

    assert.throws(function () {
        mx([1]).all([2], 1);
    }, 'non-function predicate');
});

})));

