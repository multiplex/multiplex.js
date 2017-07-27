(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
	typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
	(factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = mx && mx.hasOwnProperty('default') ? mx['default'] : mx;

var qunit$1 = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit$1.module;
var qtest = qunit$1.test;

qmodule('set');

var Set = mx.Set;

qtest('create set', function (assert) {
    assert.ok(new Set() !== null, 'empty set');
    assert.ok(new Set([1, 2, 3]) !== null, 'simple numeric Set');
});


qtest('set toString', function (assert) {
    assert.equal(new Set().toString(), '[Set]', 'Set toString');
});

})));

