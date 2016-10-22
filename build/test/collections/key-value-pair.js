(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('key-value-pair');

var KeyValuePair = mx.KeyValuePair;

qtest('create key-value-pair', function (assert) {
    assert.ok(new KeyValuePair('key', 'value') !== null, 'empty key-value-pair');
});


qtest('key-value-pair toString', function (assert) {
    assert.equal(new KeyValuePair().toString(), '[KeyValuePair]', 'KeyValuePair toString');
});

})));

