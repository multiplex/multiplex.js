(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
	typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
	(factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = mx && mx.hasOwnProperty('default') ? mx['default'] : mx;

var qunit$1 = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit$1.module;
var qtest = qunit$1.test;

qmodule('linked-list');

var LinkedList = mx.LinkedList;

qtest('create linked-list', function (assert) {
    assert.ok(new LinkedList() !== null, 'empty linked-list');
    assert.ok(new LinkedList([1, 2, 3]) !== null, 'simple numeric LinkedList');
});


qtest('linked-list toString', function (assert) {
    assert.equal(new LinkedList().toString(), '[Linked List]', 'LinkedList toString');
});

})));

