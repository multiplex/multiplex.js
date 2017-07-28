(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('map');

var Map = mx.Map;

qtest('create map', function (assert) {
    assert.ok(new Map() !== null, 'empty map');
    assert.ok(new Map([[1, 1], [2, 2], [3, 3]]) !== null, 'simple numeric Map');
});


qtest('map toString', function (assert) {
    assert.equal(new Map().toString(), '[Map]', 'Map toString');
});

})));

