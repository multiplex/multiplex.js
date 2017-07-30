(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('list');

var List = mx.List;

function positiveMatch(t) {
    return t > 0;
}

qtest('create list', function (assert) {
    var list = new List(1, 2, 3);
    assert.ok(new List() !== null, 'empty list');
    assert.ok(list.count() === 3, 'simple numeric list');

    list.exists(positiveMatch);
    list.find(positiveMatch);
    list.findIndex(positiveMatch);
    list.findLast(positiveMatch);
    list.findLastIndex(positiveMatch);
    list.findAll(positiveMatch);
    list.findIndex(0, positiveMatch);
    list.findLastIndex(0, positiveMatch);
    list.add(1);
    list.get(0);
    list.get(0, 2);
    list.set(0, 8);
    list.binarySearch(1);
    list.insert(0, 0);
    list.remove(0);
    list.remove(10);
    list.sort();
    list.add(-1);
    list.trueForAll(positiveMatch);
    list.removeAll(positiveMatch);
    list.clear();

    var arr1 = new Array(2);
    var l1 = new List(2);
    l1.copyTo(arr1, 0);
    l1.removeRange(0, 2);

    assert.throws(function () {
        l1.get(10);
    }, 'throws an error on out of range index!');
});


qtest('list toString', function (assert) {
    assert.equal(new List().toString(), '[List]', 'List toString');
});

})));

