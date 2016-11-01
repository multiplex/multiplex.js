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

qmodule('linq-average');


function simpleNumericSelector(t) {
    return t * 2;
}

qtest('basic "average" test', function (assert) {
    assert.equal(mx(array).average(), 3, 'Test average of first 5 numbers');
    assert.equal(mx(array).average(simpleNumericSelector), 6, 'Test average of first 5 numbers using a selector');
});


qtest('collections "average" method tests', function (assert) {
    assert.equal(collection.average(), 3, 'Test average of numbers in a Collection');
    assert.equal(collection.average(simpleNumericSelector), 6, 'Test average of numbers in a Collection with a selector');

    assert.equal(list.average(), 3, 'Test average of numbers in a List');
    assert.equal(list.average(simpleNumericSelector), 6, 'Test average of numbers in a List with a selector');

    assert.equal(readOnlyCollection.average(), 3, 'Test average of numbers in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.average(simpleNumericSelector), 6, 'Test average of numbers in a ReadOnlyCollection with a selector');

    assert.equal(linkedList.average(), 3, 'Test average of numbers in a LinkedList');
    assert.equal(linkedList.average(simpleNumericSelector), 6, 'Test average of numbers in a LinkedList with a selector');

    assert.equal(hashSet.average(), 3, 'Test average of numbers in a HashSet');
    assert.equal(hashSet.average(simpleNumericSelector), 6, 'Test average of numbers in a HashSet with a selector');

    assert.equal(stack.average(), 3, 'Test average of numbers in a Stack');
    assert.equal(stack.average(simpleNumericSelector), 6, 'Test average of numbers in a Stack with a selector');

    assert.equal(queue.average(), 3, 'Test average of numbers in a Queue');
    assert.equal(queue.average(simpleNumericSelector), 6, 'Test average of numbers in a Queue with a selector');

    assert.equal(set.average(), 3, 'Test average of numbers in a Set');
    assert.equal(set.average(simpleNumericSelector), 6, 'Test average of numbers in a Set with a selector');

    assert.equal(map.average(function (t) {
        return t[0];
    }), 3, 'Test average of numbers in a Map with a selector');

    assert.equal(dictionary.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a Dictionary with a selector');

    assert.equal(lookup.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a Lookup with a selector');

    assert.equal(sortedList.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a SortedList with a selector');
});


qtest('"average" method validations', function (assert) {
    assert.throws(function () {
        mx([]).average();
    }, 'no elements error');

    assert.throws(function () {
        mx([]).average();
    }, 'non numeric average error');

    assert.throws(function () {
        mx(['a']).average(function (t) {
            return t;
        });
    }, 'non numeric average with selector error');

    assert.throws(function () {
        mx([1]).average(1);
    }, 'non-function predicate');
});

})));

