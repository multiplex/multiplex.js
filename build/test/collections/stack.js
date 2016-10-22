(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('stack');

var Stack = mx.Stack;

qtest('create stack', function (assert) {
    assert.ok(new Stack() !== null, 'empty stack');
    assert.ok(new Stack([1, 2, 3]) !== null, 'simple numeric stack');
});


qtest('stack toString', function (assert) {
    assert.equal(new Stack().toString(), '[Stack]', 'Stack toString');
});

})));

