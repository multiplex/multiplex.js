(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('list');

var List = mx.List;

qtest('create list', function (assert) {
    assert.ok(new List() !== null, 'empty list');
    assert.ok(new List([1, 2, 3]) !== null, 'simple numeric list');
});


qtest('list toString', function (assert) {
    assert.equal(new List().toString(), '[List]', 'List toString');
});

})));

