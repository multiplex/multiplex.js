(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
	typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
	(factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = mx && mx.hasOwnProperty('default') ? mx['default'] : mx;

var qunit$1 = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit$1.module;
var qtest = qunit$1.test;

qmodule('key-value-pair');

var KeyValuePair = mx.KeyValuePair;

qtest('create key-value-pair', function (assert) {
    assert.ok(new KeyValuePair('key', 'value') !== null, 'empty key-value-pair');
});

})));

