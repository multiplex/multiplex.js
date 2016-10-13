(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('hash-set');

var HashSet = mx.HashSet;

qtest('create hash-set', function (assert) {
    assert.ok(new HashSet() !== null, 'empty hash-set');
    assert.ok(new HashSet([1, 2, 3]) !== null, 'simple numeric HashSet');
});


qtest('hash-set toString', function (assert) {
    assert.equal(new HashSet().toString(), '[HashSet]', 'HashSet toString');
});

})));

