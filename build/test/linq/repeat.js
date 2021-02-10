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

    qmodule('linq-repeat');

    qtest('basic "repeat" tests', function (assert) {
        assert.equal(mx__default['default'].repeat(1, 5).count(), 5, 'Test repeat a number 5 times');
        assert.equal(mx__default['default'].repeat(1, 0).count(), 0, 'Test repeat a number zero times');
        assert.deepEqual(mx__default['default'].repeat(1, 5).toArray(), [1, 1, 1, 1, 1], 'Test repeat value 5 times');
    });


    qtest('repeat method validations', function (assert) {
        assert.throws(function () {
            mx__default['default'].repeat();
        }, 'undefined count');

        assert.throws(function () {
            mx__default['default'].repeat(5, true);
        }, 'non-number count');

        assert.throws(function () {
            mx__default['default'].repeat(0, -5);
        }, 'negative count');
    });

})));

