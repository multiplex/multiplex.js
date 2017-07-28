(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('sorted-list');

var SortedList = mx.SortedList;

qtest('create sorted-list', function (assert) {
    assert.ok(new SortedList() !== null, 'empty sorted-list');
});


qtest('basic sorted-list tests', function (assert) {
    var dic = mx([1, 2, 3, 4, 5]).toDictionary(function (t) {
        return t;
    });
    var list = new SortedList(dic);

    assert.ok(list.count() === 5, 'basic sorted-list test');
    assert.ok(list.keys().length === 5, 'basic sorted-list test');
    assert.ok(list.values().length === 5, 'basic sorted-list test');

    list.get(1);
    list.containsKey(1);
    list.containsValue(1);
    list.indexOfKey(1);
    list.indexOfValue(1);
    list.remove(1);
    list.removeAt(0);
    list.set(1, 1);
    list.trimExcess();
    list.insert(1, 1, 1);
    list.tryGetValue(1, function () {
    });
    list.clear();
});

qtest('sorted-list toString', function (assert) {
    assert.equal(new SortedList().toString(), '[SortedList]', 'SortedList toString');
});

})));

