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

qtest('basic aggregate over numbers', function (assert) {
    assert.equal(mx(array).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate 5 numbers with seed!');

    assert.equal(mx(array).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate 5 numbers with seed and result selector!');
});


qtest('collections aggregate', function (assert) {
    assert.equal(mx(collection).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate collection of numbers with seed!');

    assert.equal(mx(collection).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate collection of numbers with seed and result selector!');



    assert.equal(mx(list).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate list of numbers with seed!');

    assert.equal(mx(list).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate list of numbers with seed and result selector!');



    assert.equal(mx(linkedList).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate linkedList of numbers with seed!');

    assert.equal(mx(linkedList).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate linkedList of numbers with seed and result selector!');



    assert.equal(mx(hashSet).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate hashSet of numbers with seed!');

    assert.equal(mx(hashSet).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate hashSet of numbers with seed and result selector!');



    assert.equal(mx(stack).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate stack of numbers with seed!');

    assert.equal(mx(stack).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate stack of numbers with seed and result selector!');



    assert.equal(mx(queue).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate queue of numbers with seed!');

    assert.equal(mx(queue).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate queue of numbers with seed and result selector!');



    assert.equal(mx(set).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate set of numbers with seed!');

    assert.equal(mx(set).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate set of numbers with seed and result selector!');



    assert.equal(mx(map).aggregate(10, function (a, b) {
        return a + b[0];
    }), 25, 'Aggregate map of numbers with seed!');

    assert.equal(mx(map).aggregate(10, function (a, b) {
        return a + b[0];
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate map of numbers with seed and result selector!');



    assert.equal(mx(dictionary).aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate dictionary of numbers with seed!');

    assert.equal(mx(dictionary).aggregate(10, function (a, b) {
        return a + b.key;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate dictionary of numbers with seed and result selector!');



    assert.equal(mx(sortedList).aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate sortedList of numbers with seed!');

    assert.equal(mx(sortedList).aggregate(10, function (a, b) {
        return a + b.key;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate sortedList of numbers with seed and result selector!');



    assert.equal(mx(readOnlyCollection).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate readOnlyCollection of numbers with seed!');

    assert.equal(mx(readOnlyCollection).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate readOnlyCollection of numbers with seed and result selector!');



    assert.equal(mx(lookup).aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate lookup of numbers with seed!');

    assert.equal(mx(lookup).aggregate(10, function (a, b) {
        return a + b.key;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate lookup of numbers with seed and result selector!');
});

})));

