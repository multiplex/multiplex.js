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

qmodule('linq-join');

var numbers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
var strings = numbers.join(',').split(',');

var identity = function (t) {
    return t;
};

var str2num = function (t) {
    return parseInt(t);
};


qtest('basic "join" tests', function (assert) {
    assert.equal(mx(numbers).join(array, identity, identity, identity).count(), array.length, ' join count of an array of separate numbers');
    assert.equal(mx(array).join(numbers, identity, identity, identity).count(), array.length, ' join count of an array of separate numbers');
    assert.deepEqual(mx(array).join(numbers, identity, identity, identity).toArray(), array, ' join result of an array of separate numbers');

    assert.equal(mx([1, 1, 1]).join(array, identity, identity, identity).count(), 3, ' join count of an array of identical numbers');
    assert.equal(mx(array).join([1, 1, 1], identity, identity, identity).count(), 3, ' join count of an array of identical numbers');
    assert.deepEqual(mx([1, 1, 1]).join(numbers, identity, identity, identity).toArray(), [1, 1, 1], ' join result of an array of identical numbers');

    assert.equal(mx([]).join(array, identity, identity, identity).count(), 0, ' join count of an empty array');
    assert.equal(mx(array).join([], identity, identity, identity).count(), 0, ' join count of an empty array');
    assert.equal(mx(array).join([null], identity, identity, identity).count(), 0, ' join count of an null array');
    assert.equal(mx(array).join([undefined], identity, identity, identity).count(), 0, ' join count of an undefined array');
    assert.deepEqual(mx(numbers).join(numbers, identity, identity, identity).toArray(), numbers, ' join result of the same array');

    assert.equal(mx(strings).join(numbers, str2num, identity, identity).count(), numbers.length, ' join count of an array of separate strings');
    assert.equal(mx(numbers).join(strings, identity, str2num, identity).count(), numbers.length, ' join count of an array of separate strings');
    assert.deepEqual(mx(strings).join(numbers, str2num, identity, identity).toArray(), strings, ' join result of an array of separate strings');
    assert.deepEqual(mx(numbers).join(strings, identity, str2num, identity).toArray(), numbers, ' join result of an array of separate strings');

    assert.equal(mx([true, false, true]).join([false], identity, identity, identity).count(), 1, ' join count of a boolean array');
    assert.equal(mx([true, false, true]).join([true], identity, identity, identity).count(), 2, ' join count of a boolean array');
    assert.equal(mx([new Date(2017, 0, 1), new Date(2017, 0, 2)]).join([new Date(2017, 0, 2), new Date(2017, 0, 3)], identity, identity, identity).count(), 1, ' join count of a date array');
    assert.equal(mx([{ val: 1 }, { val: 2 }]).join([{ val: 2 }, { val: 3 }], identity, identity, identity).count(), 1, ' join count of a object literal array');
});


// qtest('"distinct" test using comparer', function (assert) {
//     assert.equal(mx([{ val: 1, name: 'A' }, { val: 1, name: 'B' }, { val: 1, name: 'C' }]).distinct({
//         hash: function (t) {
//             return t.val;
//         },
//         equals: function (a, b) {
//             return a.val === b.val && a.name === b.name;
//         }
//     }).count(), 3, 'distinct count of an array of distinct object literals using comparer');
// });


// qtest('collections "distinct" method tests', function (assert) {
//     var numericComparer = {
//         hash: function (t) {
//             return t % 2;
//         },
//         equals: function (a, b) {
//             return a === b;
//         }
//     };

//     assert.equal(mocks.collection.distinct().count(), 5, 'Test "distinct" in a Collection');
//     assert.equal(mocks.collection.distinct(numericComparer).count(), 5, 'Test "distinct" in a Collection with comparer');

//     assert.equal(mocks.list.distinct().count(), 5, 'Test "distinct" in a List');
//     assert.equal(mocks.list.distinct(numericComparer).count(), 5, 'Test "distinct" in a List with comparer');

//     assert.equal(mocks.readOnlyCollection.distinct().count(), 5, 'Test "distinct" in a ReadOnlyCollection');
//     assert.equal(mocks.readOnlyCollection.distinct(numericComparer).count(), 5, 'Test "distinct" in a ReadOnlyCollection with comparer');

//     assert.equal(mocks.linkedList.distinct().count(), 5, 'Test "distinct" in a LinkedList');
//     assert.equal(mocks.linkedList.distinct(numericComparer).count(), 5, 'Test "distinct" in a LinkedList with comparer');

//     assert.equal(mocks.hashSet.distinct().count(), 5, 'Test "distinct" in a HashSet');
//     assert.equal(mocks.hashSet.distinct(numericComparer).count(), 5, 'Test "distinct" in a HashSet with comparer');

//     assert.equal(mocks.stack.distinct().count(), 5, 'Test "distinct" in a Stack');
//     assert.equal(mocks.stack.distinct(numericComparer).count(), 5, 'Test "distinct" in a Stack with comparer');

//     assert.equal(mocks.queue.distinct().count(), 5, 'Test "distinct" in a Queue');
//     assert.equal(mocks.queue.distinct(numericComparer).count(), 5, 'Test "distinct" in a Queue with comparer');

//     assert.equal(mocks.set.distinct().count(), 5, 'Test "distinct" in a Set');
//     assert.equal(mocks.set.distinct(numericComparer).count(), 5, 'Test "distinct" in a Set with comparer');

//     var mapComparer = {
//         hash: function (t) {
//             return t[0] % 2;
//         },
//         equals: function (a, b) {
//             return a[0] === b[0];
//         }
//     };

//     assert.equal(mocks.map.distinct().count(), 5, 'Test "distinct" in a Map');
//     assert.equal(mocks.map.distinct(mapComparer).count(), 5, 'Test "distinct" in a Map with comparer');

//     var keyValuePairComparer = {
//         hash: function (t) {
//             return t.key % 2;
//         },
//         equals: function (a, b) {
//             return a.key === b.key;
//         }
//     };

//     assert.equal(mocks.dictionary.distinct().count(), 5, 'Test "distinct" in a Dictionary');
//     assert.equal(mocks.dictionary.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Dictionary with comparer');

//     assert.equal(mocks.lookup.distinct().count(), 5, 'Test "distinct" in a Lookup');
//     assert.equal(mocks.lookup.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Lookup with comparer');

//     assert.equal(mocks.sortedList.distinct().count(), 5, 'Test "distinct" in a SortedList');
//     assert.equal(mocks.sortedList.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a SortedList with comparer');
// });

})));

