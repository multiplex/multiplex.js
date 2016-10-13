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


qtest('sorted-list toString', function (assert) {
    assert.equal(new SortedList().toString(), '[SortedList]', 'SortedList toString');
});

})));

