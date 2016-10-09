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

qmodule('linq-zip');


function simpleNumericSelector(t, u) {
    return t + u;
}

qtest('homogeneous zip', function (assert) {
    assert.deepEqual(mx([1, 2]).zip([3, 4], simpleNumericSelector).toArray(), [4, 6], 'Zip two numeric array!');
    assert.deepEqual(mx('ab').zip('cd', simpleNumericSelector).toArray(), ['ac', 'bd'], 'Zip two string objects!');
});


qtest('heterogeneous zip', function (assert) {
    assert.deepEqual(mx([1, 2]).zip([3], simpleNumericSelector).toArray(), [4], 'Zip two numeric array!');
    assert.deepEqual(mx('ab').zip('c', simpleNumericSelector).toArray(), ['ac'], 'Zip two string objects!');
    assert.deepEqual(mx([]).zip([3], simpleNumericSelector).toArray(), [], 'Zip an empty iterable with anything results in an empty iterable!');
    assert.deepEqual(mx([1, 2]).zip([], simpleNumericSelector).toArray(), [], 'Zip anything with an empty iterable results in an empty iterable!');
});


qtest('collections zip', function (assert) {
    assert.deepEqual(collection.zip(collection, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two Collections!');

    assert.deepEqual(list.zip(list, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two Lists!');

    assert.deepEqual(readOnlyCollection.zip(readOnlyCollection, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two ReadOnlyCollection!');

    assert.deepEqual(linkedList.zip(linkedList, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two LinkedList!');

    assert.deepEqual(hashSet.zip(hashSet, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two HashSet!');

    assert.deepEqual(stack.zip(stack, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two Stack!');

    assert.deepEqual(queue.zip(queue, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two Queue!');

    assert.deepEqual(set.zip(set, simpleNumericSelector).toArray(), [2, 4, 6, 8, 10], 'Zip two Sets!');

    assert.deepEqual(map.zip(map, function (t, u) {
        return t[0] + u[0];
    }).toArray(), [2, 4, 6, 8, 10], 'Zip two Maps!');

    assert.deepEqual(dictionary.zip(dictionary, function (t, u) {
        return t.key + u.key;
    }).toArray(), [2, 4, 6, 8, 10], 'Zip two Dictionary!');

    assert.deepEqual(lookup.zip(lookup, function (t, u) {
        return t.key + u.key;
    }).toArray(), [2, 4, 6, 8, 10], 'Zip two Lookup!');

    assert.deepEqual(sortedList.zip(sortedList, function (t, u) {
        return t.key + u.key;
    }).toArray(), [2, 4, 6, 8, 10], 'Zip two SortedList!');
});


qtest('zip method validations', function (assert) {
    assert.throws(function () {
        mx([1]).zip();
    }, 'null input');

    assert.throws(function () {
        mx([1]).zip([2]);
    }, 'null result selector');

    assert.throws(function () {
        mx([1]).zip([2], 1);
    }, 'non-function result selector');
});

})));

