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

qmodule('linq-aggregate');


function sumAggregateFunc(a, b) {
    return a + b;
}

function simpleAggregateResult(t) {
    return t * 2;
}


qtest('basic aggregate over numbers', function (assert) {
    assert.equal(mx(array).aggregate(10, sumAggregateFunc), 25, 'Aggregate 5 numbers with seed!');

    assert.equal(mx(array).aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate 5 numbers with seed and result selector!');
});


qtest('collections aggregate', function (assert) {
    assert.equal(collection.aggregate(10, sumAggregateFunc), 25, 'Aggregate collection of numbers with seed!');
    assert.equal(collection.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate collection of numbers with seed and result selector!');


    assert.equal(list.aggregate(10, sumAggregateFunc), 25, 'Aggregate list of numbers with seed!');
    assert.equal(list.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate list of numbers with seed and result selector!');


    assert.equal(readOnlyCollection.aggregate(10, sumAggregateFunc), 25, 'Aggregate readOnlyCollection of numbers with seed!');
    assert.equal(readOnlyCollection.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate readOnlyCollection of numbers with seed and result selector!');


    assert.equal(linkedList.aggregate(10, sumAggregateFunc), 25, 'Aggregate linkedList of numbers with seed!');
    assert.equal(linkedList.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate linkedList of numbers with seed and result selector!');


    assert.equal(hashSet.aggregate(10, sumAggregateFunc), 25, 'Aggregate hashSet of numbers with seed!');
    assert.equal(hashSet.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate hashSet of numbers with seed and result selector!');


    assert.equal(stack.aggregate(10, sumAggregateFunc), 25, 'Aggregate stack of numbers with seed!');
    assert.equal(stack.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate stack of numbers with seed and result selector!');


    assert.equal(queue.aggregate(10, sumAggregateFunc), 25, 'Aggregate queue of numbers with seed!');
    assert.equal(queue.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate queue of numbers with seed and result selector!');


    assert.equal(set.aggregate(10, sumAggregateFunc), 25, 'Aggregate set of numbers with seed!');
    assert.equal(set.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate set of numbers with seed and result selector!');

    assert.equal(map.aggregate(10, function (a, b) {
        return a + b[0];
    }), 25, 'Aggregate map of numbers with seed!');

    assert.equal(map.aggregate(10, function (a, b) {
        return a + b[0];
    }, simpleAggregateResult), 50, 'Aggregate map of numbers with seed and result selector!');


    assert.equal(dictionary.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate dictionary of numbers with seed!');

    assert.equal(dictionary.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate dictionary of numbers with seed and result selector!');


    assert.equal(sortedList.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate sortedList of numbers with seed!');

    assert.equal(sortedList.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate sortedList of numbers with seed and result selector!');


    assert.equal(lookup.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate lookup of numbers with seed!');

    assert.equal(lookup.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate lookup of numbers with seed and result selector!');
});



qtest('aggregate method validations', function (assert) {
    assert.throws(function () {
        mx([1]).aggregate();
    }, 'null input');

    assert.throws(function () {
        mx([1]).aggregate(0, 0);
    }, 'non-function aggregate function');

    assert.throws(function () {
        mx([1]).aggregate(0, sumAggregateFunc, 1);
    }, 'non-function resultSelector');
});

})));

