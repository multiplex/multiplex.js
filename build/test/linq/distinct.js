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

qmodule('linq-distinct');


qtest('basic "distinct" test', function (assert) {
    assert.equal(mx(array).distinct().count(), 5, ' distinct count of an array of separate numbers');
    assert.equal(mx([1, 1, 1]).distinct().count(), 1, ' distinct count of an array of identical numbers');
    assert.equal(mx(['1', '1', '1']).distinct().count(), 1, ' distinct count of an array of identical strings');
    assert.equal(mx([true, true, true]).distinct().count(), 1, ' distinct count of an array of identical booleans');
    assert.equal(mx([null, null, null]).distinct().count(), 1, ' distinct count of an array of null values');
    assert.equal(mx([new Date(2017, 0, 1), new Date(2017, 0, 1), new Date(2017, 0, 1)]).distinct().count(), 1, ' distinct count of an array of identical dates');
    assert.equal(mx([{ val: 1 }, { val: 1 }, { val: 1 }]).distinct().count(), 1, ' distinct count of an array of identical object literals');
    assert.equal(mx([]).distinct().count(), 0, 'distinct count of an empty array');
});


qtest('"distinct" test using comparer', function (assert) {
    assert.equal(mx([{ val: 1, name: 'A' }, { val: 1, name: 'B' }, { val: 1, name: 'C' }]).distinct({
        hash: function (t) {
            return t.val;
        },
        equals: function (a, b) {
            return a.val === b.val && a.name === b.name;
        }
    }).count(), 3, 'distinct count of an array of distinct object literals using comparer');
});


qtest('collections "distinct" method tests', function (assert) {
    var numericComparer = {
        hash: function (t) {
            return t % 2;
        },
        equals: function (a, b) {
            return a === b;
        }
    };

    assert.equal(collection.distinct().count(), 5, 'Test "distinct" in a Collection');
    assert.equal(collection.distinct(numericComparer).count(), 5, 'Test "distinct" in a Collection with comparer');

    assert.equal(list.distinct().count(), 5, 'Test "distinct" in a List');
    assert.equal(list.distinct(numericComparer).count(), 5, 'Test "distinct" in a List with comparer');

    assert.equal(readOnlyCollection.distinct().count(), 5, 'Test "distinct" in a ReadOnlyCollection');
    assert.equal(readOnlyCollection.distinct(numericComparer).count(), 5, 'Test "distinct" in a ReadOnlyCollection with comparer');

    assert.equal(linkedList.distinct().count(), 5, 'Test "distinct" in a LinkedList');
    assert.equal(linkedList.distinct(numericComparer).count(), 5, 'Test "distinct" in a LinkedList with comparer');

    assert.equal(hashSet.distinct().count(), 5, 'Test "distinct" in a HashSet');
    assert.equal(hashSet.distinct(numericComparer).count(), 5, 'Test "distinct" in a HashSet with comparer');

    assert.equal(stack.distinct().count(), 5, 'Test "distinct" in a Stack');
    assert.equal(stack.distinct(numericComparer).count(), 5, 'Test "distinct" in a Stack with comparer');

    assert.equal(queue.distinct().count(), 5, 'Test "distinct" in a Queue');
    assert.equal(queue.distinct(numericComparer).count(), 5, 'Test "distinct" in a Queue with comparer');

    assert.equal(set.distinct().count(), 5, 'Test "distinct" in a Set');
    assert.equal(set.distinct(numericComparer).count(), 5, 'Test "distinct" in a Set with comparer');

    var mapComparer = {
        hash: function (t) {
            return t[0] % 2;
        },
        equals: function (a, b) {
            return a[0] === b[0];
        }
    };

    assert.equal(map.distinct().count(), 5, 'Test "distinct" in a Map');
    assert.equal(map.distinct(mapComparer).count(), 5, 'Test "distinct" in a Map with comparer');

    var keyValuePairComparer = {
        hash: function (t) {
            return t.key % 2;
        },
        equals: function (a, b) {
            return a.key === b.key;
        }
    };

    assert.equal(dictionary.distinct().count(), 5, 'Test "distinct" in a Dictionary');
    assert.equal(dictionary.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Dictionary with comparer');

    assert.equal(lookup.distinct().count(), 5, 'Test "distinct" in a Lookup');
    assert.equal(lookup.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Lookup with comparer');

    assert.equal(sortedList.distinct().count(), 5, 'Test "distinct" in a SortedList');
    assert.equal(sortedList.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a SortedList with comparer');
});

})));

