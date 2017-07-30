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
    assert.ok(dic.containsValue(1), 'dictionary contains value');

    dic.remove('A');
    assert.ok(dic.containsKey('A') === false, 'dictionary remove');
    assert.ok(dic.containsValue(1) === false, 'dictionary does not contain value');

    dic.add('A', 1);
    dic = new Dictionary(dic);
    dic.comparer.hash(1);

    var val = null;
    var callback = function (v) {
        val = v;
    };
    dic.tryGetValue('A', callback);
    dic.tryGetValue('B', callback);

    assert.throws(function () {
        dic.get(2);
    }, 'throws an error gettig item that does not exist!');

    dic.clear();
});


qtest('dictionary toString', function (assert) {
    var dic = new Dictionary();
    assert.equal(dic.toString(), '[Dictionary]', 'Dictionary toString');
    assert.equal(mx.iter(dic).toString(), '[KeyValue Iterator]', 'Dictionary iterator toString');
});

})));

