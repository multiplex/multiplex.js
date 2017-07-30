(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('read-only-collection');

var ReadOnlyCollection = mx.ReadOnlyCollection;

qtest('create read-only-collection', function (assert) {
    assert.ok(new ReadOnlyCollection([]) !== null, 'empty read-only-collection');
});

})));

