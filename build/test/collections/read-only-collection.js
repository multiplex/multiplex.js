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

    qmodule('read-only-collection');

    var ReadOnlyCollection = mx__default['default'].ReadOnlyCollection;

    qtest('create read-only-collection', function (assert) {
        assert.ok(new ReadOnlyCollection([]) !== null, 'empty read-only-collection');

        var list = new ReadOnlyCollection([1, 2, 3]);
        assert.ok(list.count() === 3, 'simple numeric ReadOnlyCollection');

        list.get(1);
        list.indexOf(1);

        assert.throws(function () {
            list = new ReadOnlyCollection(1);
        }, 'invalid input');
    });


    qtest('read-only-collection toString', function (assert) {
        assert.equal(new ReadOnlyCollection([]).toString(), '[ReadOnlyCollection]', 'ReadOnlyCollection toString');
    });

})));

