(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('lookup');

var Lookup = mx.Lookup;

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

