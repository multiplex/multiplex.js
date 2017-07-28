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

qmodule('linq-sequence-equal');


qtest('basic "sequenceEqual" test', function (assert) {
    assert.ok(mx([]).sequenceEqual([]), 'sequenceEqual two empty arrays');
    assert.ok(!mx([1, 2]).sequenceEqual([]), 'sequenceEqual an array with empty array');
    assert.ok(!mx([]).sequenceEqual([1, 2]), 'sequenceEqual empty array with an array');
    assert.ok(!mx([1, 2]).sequenceEqual([3, 4]), 'sequenceEqual two arrays');
    assert.ok(mx([1, 2]).sequenceEqual([1, 2]), 'sequenceEqual two identical arrays');

    assert.ok(mx('string').sequenceEqual('string'), 'sequenceEqual two identical strings');
    assert.ok(!mx('string').sequenceEqual('string1'), 'sequenceEqual two identical strings');

    assert.ok(mx([true, false]).sequenceEqual([true, false]), 'sequenceEqual two identical boolean');
    assert.ok(!mx([true, false]).sequenceEqual([false, true]), 'sequenceEqual two identical boolean');

    assert.ok(mx([new Date(2017, 1, 1)]).sequenceEqual([new Date(2017, 1, 1)]), 'sequenceEqual two identical dates');
    assert.ok(!mx([new Date(2017, 1, 1)]).sequenceEqual([new Date(2016, 1, 1)]), 'sequenceEqual two identical dates');
});


qtest('equalityComparer "sequenceEqual" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val;
        }
    };

    comparer.hash(1);
    assert.ok(mx([{ val: 1, index: 1 }]).sequenceEqual([{ val: 1, index: 2 }], comparer), 'Test sequenceEqual in an array of objects with equality comparer');
    assert.ok(!mx([{ val: 1, index: 1 }]).sequenceEqual([{ val: 2, index: 2 }], comparer), 'Test sequenceEqual an array of objects with equality comparer');
});


qtest('hash/equals override "sequenceEqual" test', function (assert) {
    assert.ok(mx([new Basic(1, 'A'), new Basic(2, 'B')]).sequenceEqual([new Basic(1, 'A'), new Basic(2, 'B')]), 'Test sequenceEqual in an array of objects overriding hash/equals methods');
    assert.ok(!mx([new Basic(1, 'A')]).sequenceEqual([new Basic(3, 'A')]), 'Test sequenceEqual in an array of objects overriding hash/equals methods');
});


qtest('collections "sequenceEqual" method tests', function (assert) {
    assert.ok(!enumerable.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in an enumerable');
    assert.ok(enumerable.sequenceEqual(enumerable), 'Test "sequenceEqual" in an enumerable');

    assert.ok(!collection.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Collection');
    assert.ok(collection.sequenceEqual(collection), 'Test "sequenceEqual" in a Collection');

    assert.ok(!list.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a List');
    assert.ok(list.sequenceEqual(collection), 'Test "sequenceEqual" in a List');

    assert.ok(!readOnlyCollection.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a ReadOnlyCollection');
    assert.ok(readOnlyCollection.sequenceEqual(collection), 'Test "sequenceEqual" in a ReadOnlyCollection');

    assert.ok(!linkedList.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a LinkedList');
    assert.ok(linkedList.sequenceEqual(collection), 'Test "sequenceEqual" in a LinkedList');

    assert.ok(!hashSet.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a HashSet');
    assert.ok(hashSet.sequenceEqual(collection), 'Test "sequenceEqual" in a HashSet');

    assert.ok(!stack.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Stack');
    assert.ok(stack.sequenceEqual(collection), 'Test "sequenceEqual" in a Stack');

    assert.ok(!queue.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Queue');
    assert.ok(queue.sequenceEqual(collection), 'Test "sequenceEqual" in a Queue');

    assert.ok(!set.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Set');
    assert.ok(set.sequenceEqual(set), 'Test "sequenceEqual" in a Set');

    assert.ok(!map.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Map');
    assert.ok(!map.sequenceEqual(map), 'Test "sequenceEqual" in a Map');

    assert.ok(!dictionary.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Dictionary');
    assert.ok(dictionary.sequenceEqual(dictionary), 'Test "sequenceEqual" in a Dictionary');

    assert.ok(!lookup.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Lookup');
    assert.ok(lookup.sequenceEqual(lookup), 'Test "sequenceEqual" in a Lookup');

    assert.ok(!sortedList.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a SortedList');
    assert.ok(sortedList.sequenceEqual(sortedList), 'Test "sequenceEqual" in a SortedList');
});


qtest('sequenceEqual method validations', function (assert) {
    assert.throws(function () {
        mx([1]).sequenceEqual();
    }, 'null input');
});

})));

