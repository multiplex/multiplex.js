(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
	typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
	(factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = mx && mx.hasOwnProperty('default') ? mx['default'] : mx;

var qunit$1 = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit$1.module;
var qtest = qunit$1.test;

qmodule('linq-repeat');

qtest('basic "repeat" tests', function (assert) {
    assert.equal(mx.repeat(1, 5).count(), 5, 'Test repeat a number 5 times');
    assert.equal(mx.repeat(1, 0).count(), 0, 'Test repeat a number zero times');
    assert.deepEqual(mx.repeat(1, 5).toArray(), [1, 1, 1, 1, 1], 'Test repeat value 5 times');
});


qtest('repeat method validations', function (assert) {
    assert.throws(function () {
        mx.repeat();
    }, 'undefined count');

    assert.throws(function () {
        mx.repeat(5, true);
    }, 'non-number count');

    assert.throws(function () {
        mx.repeat(0, -5);
    }, 'negative count');
});

})));

