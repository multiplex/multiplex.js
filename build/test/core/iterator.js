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

    qmodule('iterator');

    qtest('create iterator', function (assert) {
        var index = 0;
        var it = new mx__default['default'].Iterator(function () {
            if (index++ < 1) {
                return {
                    value: index,
                    done: false
                };
            }

            return {
                done: true
            };
        });
        var result;

        assert.ok(it !== null, 'iterable function');

        result = it.next();
        assert.equal(result.value, 1, 'iterable result value');
        assert.equal(result.done, false, 'iterable result done');

        result = it.next();
        assert.equal(result.value, undefined, 'iterable result value when done is undefined');
        assert.equal(result.done, true, 'iterable result done when done is true');

        result = it.next();
        assert.equal(result.value, undefined, 'consecutive iterable result when done is undefined');
        assert.equal(result.done, true, 'consecutive iterable result done when done is true');

        assert.throws(function () {
            it = new mx__default['default'].Iterator(null);
        }, 'Iterator throws exception when passed null');

        assert.throws(function () {
            it = new mx__default['default'].Iterator(undefined);
        }, 'Iterator throws exception when passed undefined');

        assert.throws(function () {
            it = new mx__default['default'].Iterator(1);
        }, 'Iterator throws exception when passed number');

        assert.throws(function () {
            it = new mx__default['default'].Iterator('string');
        }, 'Iterator throws exception when passed string');

        assert.throws(function () {
            it = new mx__default['default'].Iterator(true);
        }, 'Iterator throws exception when passed boolean');

        assert.throws(function () {
            it = new mx__default['default'].Iterator({});
        }, 'Iterator throws exception when passed object');

        assert.equal(it.toString(), '[Iterator]', 'Iterator toString');
    });

})));

