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

qmodule('linq-order-by');

function identity(t) {
    return t;
}

qtest('basic "order-by" tests', function (assert) {
    assert.equal(mx.range(0, 50).orderBy(identity).toArray()[0], 0, 'Test orderBy for array of numbers');
    assert.equal(mx('string').orderBy(identity).last(), 't', 'Test orderBy for array of string');

    assert.deepEqual(mx([{ a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }])
        .orderBy(function (t) {
            return t.a;
        })
        .thenBy(function (t) {
            return t.b;
        })
        .thenByDescending(function (t) {
            return t.c;
        })
        .toArray(), [{ a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }, { a: 2, b: 3, c: 1 }], 'Test orderBy for array of objects');
});

qtest('collections "order-by" method tests', function (assert) {
    assert.equal(enumerable.orderBy(identity).last(), 5, 'Test orderBy for an enumerable');
});

})));

