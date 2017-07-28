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

function Basic(val, name) {
    this.val = val;
    this.name = name;
}

Basic.prototype.__hash__ = function () {
    return this.val;
};

Basic.prototype.__eq__ = function (obj) {
    return this.val === obj.val;
};

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('linq-union');


qtest('basic "union" test', function (assert) {
    assert.deepEqual(mx([]).union([]).toArray(), [], 'union two empty arrays');
    assert.deepEqual(mx([1, 2]).union([]).toArray(), [1, 2], 'union an array with empty array');
    assert.deepEqual(mx([1, 2]).union([3, 4]).toArray(), [1, 2, 3, 4], 'union two arrays');
    assert.deepEqual(mx([1, 2]).union([1, 2]).toArray(), [1, 2], 'union two identical arrays');
});


qtest('equalityComparer "union" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val;
        }
    };

    assert.equal(mx([{ val: 1, index: 1 }]).union([{ val: 1, index: 2 }], comparer).toArray().length, 1, 'Test union in an array of objects with equality comparer');
    assert.equal(mx([{ val: 1, index: 1 }]).union([{ val: 2, index: 2 }], comparer).toArray().length, 2, 'Test union an array of objects with equality comparer');
});


qtest('hash/equals override "union" test', function (assert) {
    assert.equal(mx([new Basic(1, 'A'), new Basic(2, 'B')]).union([new Basic(1, 'C')]).toArray().length, 2, 'Test union in an array of objects overriding hash/equals methods');
    assert.equal(mx([new Basic(1, 'A'), new Basic(2, 'B')]).union([new Basic(3, 'A')]).toArray().length, 3, 'Test union in an array of objects overriding hash/equals methods');
});


qtest('collections "union" method tests', function (assert) {
    var len = array.length;

    assert.equal(enumerable.union([]).toArray().length, len, 'Test "union" with an empty array in an enumerable');
    assert.equal(enumerable.union(enumerable).toArray().length, len, 'Test "union" in an enumerable');

    assert.equal(collection.union([]).toArray().length, len, 'Test "union" with an empty array in a Collection');
    assert.equal(collection.union(collection).toArray().length, len, 'Test "union" in a Collection');

    assert.equal(list.union([]).toArray().length, len, 'Test "union" with an empty array in a List');
    assert.equal(list.union(collection).toArray().length, len, 'Test "union" in a List');

    assert.equal(readOnlyCollection.union([]).toArray().length, len, 'Test "union" with an empty array in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.union(collection).toArray().length, len, 'Test "union" in a ReadOnlyCollection');

    assert.equal(linkedList.union([]).toArray().length, len, 'Test "union" with an empty array in a LinkedList');
    assert.equal(linkedList.union(collection).toArray().length, len, 'Test "union" in a LinkedList');

    assert.equal(hashSet.union([]).toArray().length, len, 'Test "union" with an empty array in a HashSet');
    assert.equal(hashSet.union(collection).toArray().length, len, 'Test "union" in a HashSet');

    assert.equal(stack.union([]).toArray().length, len, 'Test "union" with an empty array in a Stack');
    assert.equal(stack.union(collection).toArray().length, len, 'Test "union" in a Stack');

    assert.equal(queue.union([]).toArray().length, len, 'Test "union" with an empty array in a Queue');
    assert.equal(queue.union(collection).toArray().length, len, 'Test "union" in a Queue');

    assert.equal(set.union([]).toArray().length, len, 'Test "union" with an empty array in a Set');
    assert.equal(set.union(set).toArray().length, len, 'Test "union" in a Set');

    assert.equal(map.union([]).toArray().length, len, 'Test "union" with an empty array in a Map');
    assert.equal(map.union(map).toArray().length, 2 * len, 'Test "union" in a Map');

    assert.equal(dictionary.union([]).toArray().length, len, 'Test "union" with an empty array in a Dictionary');
    assert.equal(dictionary.union(dictionary).toArray().length, len, 'Test "union" in a Dictionary');

    assert.equal(lookup.union([]).toArray().length, len, 'Test "union" with an empty array in a Lookup');
    assert.equal(lookup.union(lookup).toArray().length, len, 'Test "union" in a Lookup');

    assert.equal(sortedList.union([]).toArray().length, len, 'Test "union" with an empty array in a SortedList');
    assert.equal(sortedList.union(sortedList).toArray().length, len, 'Test "union" in a SortedList');
});


qtest('union method validations', function (assert) {
    assert.throws(function () {
        mx([1]).union();
    }, 'null input');
});

})));

