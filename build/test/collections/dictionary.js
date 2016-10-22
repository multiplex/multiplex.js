(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('dictionary');

var Dictionary = mx.Dictionary;

qtest('create dictionary', function (assert) {
    assert.ok(new Dictionary() !== null, 'empty dictionary');
});


qtest('dictionary toString', function (assert) {
    assert.equal(new Dictionary().toString(), '[Dictionary]', 'Dictionary toString');
});

})));

