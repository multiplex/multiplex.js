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

    qmodule('lookup');

    var Lookup = mx__default['default'].Lookup;

    function identity(t) {
        return t;
    }

    qtest('create lookup', function (assert) {
        assert.ok(new Lookup([1, 2, 3, 4, 5], identity) !== null, 'simple numeric Lookup');
    });


    qtest('map toString', function (assert) {
        assert.equal(new Lookup([], identity).toString(), '[Lookup]', 'Lookup toString');
    });

})));

