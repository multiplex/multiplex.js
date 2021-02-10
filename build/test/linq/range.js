(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
    var qmodule = qunit.module;
    var qtest = qunit.test;
    qunit.expect;

    qmodule('linq-range');

    qtest('basic "range" tests', function (assert) {
        assert.equal(mx__default['default'].range(0, 5).count(), 5, 'Test range of 5 numbers');
        assert.equal(mx__default['default'].range(5, 0).count(), 0, 'Test empty range of numbers');
        assert.deepEqual(mx__default['default'].range(0, 5).toArray(), [0, 1, 2, 3, 4], 'Test range value of 5 numbers');
        assert.deepEqual(mx__default['default'].range(-5, 5).toArray(), [-5, -4, -3, -2, -1], 'Test range value of 5 negative numbers');
    });


    qtest('range method validations', function (assert) {
        assert.throws(function () {
            mx__default['default'].range();
        }, 'undefined start');

        assert.throws(function () {
            mx__default['default'].range(1);
        }, 'undefined end');

        assert.throws(function () {
            mx__default['default'].range(true, 5);
        }, 'non-number start');

        assert.throws(function () {
            mx__default['default'].range(5, true);
        }, 'non-number end');

        assert.throws(function () {
            mx__default['default'].range(0, -5);
        }, 'negative end');
    });

})));

