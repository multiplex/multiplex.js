(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('comparer');

var Comparer = mx.Comparer;


function numericComparerFunction(objA, objB) {
    if (objA > objB) {
        return 1;
    }

    if (objB > objA) {
        return -1;
    }

    return 0;
}

qtest('create comparer', function (assert) {
    assert.ok(new Comparer(numericComparerFunction) !== null, 'simple numeric comparer');
    assert.ok(Comparer.instance instanceof Comparer, 'default comparer');
});


qtest('basic comparer tests', function (assert) {
    var com = new Comparer(numericComparerFunction);
    assert.equal(com.compare(1, 1), 0, 'simple numeric equality compare');
    assert.equal(com.compare(1, 0), 1, 'simple numeric greater-than compare');
    assert.equal(com.compare(0, 1), -1, 'simple numeric less-than compare');
});

qtest('comparer toString', function (assert) {
    assert.equal(new Comparer(numericComparerFunction).toString(), '[Comparer]', 'Comparer toString');
});

})));

