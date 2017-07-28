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
    var dic = new Dictionary();

    dic.add('A', 1);
    assert.ok(dic.get('A') === 1, 'dictionary add/get');

    dic.remove('A');
    assert.ok(dic.containsKey('A') === false, 'dictionary remove');

    dic.clear();
});


qtest('dictionary toString', function (assert) {
    assert.equal(new Dictionary().toString(), '[Dictionary]', 'Dictionary toString');
});

})));

