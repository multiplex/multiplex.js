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

    qmodule('key-value-pair');

    var KeyValuePair = mx__default['default'].KeyValuePair;

    qtest('create key-value-pair', function (assert) {
        assert.ok(new KeyValuePair('key', 'value') !== null, 'empty key-value-pair');
    });


    qtest('key-value-pair toString', function (assert) {
        assert.equal(new KeyValuePair().toString(), '[KeyValuePair]', 'KeyValuePair toString');
    });

})));

