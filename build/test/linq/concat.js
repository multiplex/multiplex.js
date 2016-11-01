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

qmodule('linq-concat');


qtest('basic "concat" test', function (assert) {
    assert.deepEqual(mx([]).concat([]).toArray(), [], 'concat two empty arrays');
    assert.deepEqual(mx([1, 2]).concat([]).toArray(), [1, 2], 'concat an array with empty array');
    assert.deepEqual(mx([1, 2]).concat([3, 4]).toArray(), [1, 2, 3, 4], 'concat two arrays');
    assert.deepEqual(mx([1, 2]).concat([1, 2]).toArray(), [1, 2, 1, 2], 'concat two identical arrays');
});


qtest('collections "concat" method tests', function (assert) {
    assert.equal(collection.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Collection');
    assert.equal(collection.concat(collection).toArray().length, 10, 'Test "concat" in a Collection');

    assert.equal(list.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a List');
    assert.equal(list.concat(collection).toArray().length, 10, 'Test "concat" in a List');

    assert.equal(readOnlyCollection.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.concat(collection).toArray().length, 10, 'Test "concat" in a ReadOnlyCollection');

    assert.equal(linkedList.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a LinkedList');
    assert.equal(linkedList.concat(collection).toArray().length, 10, 'Test "concat" in a LinkedList');

    assert.equal(hashSet.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a HashSet');
    assert.equal(hashSet.concat(collection).toArray().length, 10, 'Test "concat" in a HashSet');

    assert.equal(stack.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Stack');
    assert.equal(stack.concat(collection).toArray().length, 10, 'Test "concat" in a Stack');

    assert.equal(queue.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Queue');
    assert.equal(queue.concat(collection).toArray().length, 10, 'Test "concat" in a Queue');

    assert.equal(set.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Set');
    assert.equal(set.concat(collection).toArray().length, 10, 'Test "concat" in a Set');

    assert.equal(map.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Map');
    assert.equal(map.concat(collection).toArray().length, 10, 'Test "concat" in a Map');

    assert.equal(dictionary.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Dictionary');
    assert.equal(dictionary.concat(collection).toArray().length, 10, 'Test "concat" in a Dictionary');

    assert.equal(lookup.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Lookup');
    assert.equal(lookup.concat(collection).toArray().length, 10, 'Test "concat" in a Lookup');

    assert.equal(sortedList.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a SortedList');
    assert.equal(sortedList.concat(collection).toArray().length, 10, 'Test "concat" in a SortedList');
});


qtest('concat method validations', function (assert) {
    assert.throws(function () {
        mx([1]).concat();
    }, 'null input');
});

})));

