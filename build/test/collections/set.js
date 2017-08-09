(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('set');

var Set = mx.Set;

qtest('create set', function (assert) {
    assert.ok(new Set() !== null, 'empty set');
    assert.ok(new Set([1, 2, 3]) !== null, 'simple numeric Set');
});


qtest('basic set tests', function (assert) {
    var set = new Set([1, 2, 3]);
    var comparer = set.comparer;

    assert.ok(comparer.hash(1) === 1, 'set "comparer" hash test');
    assert.ok(comparer.equals(1, 1), 'set "comparer" equal test');

    set.add(4);
    set.add(5);

    assert.equal(set.count(), 5, 'set "count" test');
    assert.equal(set.entries().count(), 5, 'set "entries" test');

    assert.ok(set.has(1), 'set "has" test');
    assert.ok(!set.has(0), 'set "has" test');

    assert.deepEqual(set.values().toArray(), [1, 2, 3, 4, 5], 'set values test');

    assert.ok(set.delete(1), 'set "delete" test');
    assert.ok(!set.delete(1), 'set "delete" test');

    var el = null;
    set.forEach(function (element) {
        el = element;
    }, this);

    set.forEach(function (element) {
        el = element;
    });

    set.clear();
    assert.equal(set.count(), 0, 'set "clear" test');
});



qtest('set toString', function (assert) {
    var set = new Set();
    assert.equal(set.toString(), '[Set]', 'Set toString');
    assert.equal(mx.iter(set).toString(), '[Set Iterator]', 'Set iterator toString');
});

})));

