(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('linq-range');

qtest('basic "range" tests', function (assert) {
    assert.equal(mx.range(0, 5).count(), 5, 'Test range of 5 numbers');
    assert.equal(mx.range(5, 0).count(), 0, 'Test empty range of numbers');
    assert.deepEqual(mx.range(0, 5).toArray(), [0, 1, 2, 3, 4], 'Test range value of 5 numbers');
    assert.deepEqual(mx.range(-5, 5).toArray(), [-5, -4, -3, -2, -1], 'Test range value of 5 negative numbers');
});


qtest('range method validations', function (assert) {
    assert.throws(function () {
        mx.range();
    }, 'undefined start');

    assert.throws(function () {
        mx.range(1);
    }, 'undefined end');

    assert.throws(function () {
        mx.range(true, 5);
    }, 'non-number start');

    assert.throws(function () {
        mx.range(5, true);
    }, 'non-number end');

    assert.throws(function () {
        mx.range(0, -5);
    }, 'negative end');
});

})));

