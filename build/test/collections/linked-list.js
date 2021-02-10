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

    qmodule('linked-list');

    var LinkedList = mx__default['default'].LinkedList;

    qtest('create linked-list', function (assert) {
        assert.ok(new LinkedList() !== null, 'empty linked-list');
        assert.ok(new LinkedList([1, 2, 3]) !== null, 'simple numeric LinkedList');
    });


    qtest('linked-list toString', function (assert) {
        assert.equal(new LinkedList().toString(), '[Linked List]', 'LinkedList toString');
    });

})));

