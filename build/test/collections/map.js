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
    var map = new Map();
    assert.ok(map !== null, 'empty map');
    assert.ok(new Map([[1, 1], [2, 2], [3, 3]]) !== null, 'simple numeric Map');

    assert.throws(function () {
        map = new Map(1, 2);
    }, 'throws an error creating from non-array value');
});

qtest('basic map tests', function (assert) {
    var map = new Map([[1, 1], [2, 2], [3, 3]]);
    var comparer = map.comparer;

    assert.ok(comparer.hash(1) === 1, 'map "comparer" hash test');
    assert.ok(comparer.equals(1, 1), 'map "comparer" equal test');

    map.set(4, 4);
    map.set(5, 5);

    assert.equal(map.count(), 5, 'map "count" test');
    assert.equal(map.entries().count(), 5, 'map "entries" test');

    assert.ok(map.has(1), 'map "has" test');
    assert.ok(!map.has(0), 'map "has" test');

    assert.equal(map.get(1), 1, 'map "get" test');
    assert.equal(map.get(0), undefined, 'map "get" test');

    assert.deepEqual(map.values().toArray(), [1, 2, 3, 4, 5], 'map values test');
    assert.deepEqual(map.keys().toArray(), [1, 2, 3, 4, 5], 'map keys test');

    assert.ok(map.delete(1), 'map "delete" test');
    assert.ok(!map.delete(1), 'map "delete" test');

    var el = null;
    map.forEach(function (element) {
        el = element;
    }, this);

    map.forEach(function (element) {
        el = element;
    });

    map.clear();
    assert.equal(map.count(), 0, 'map "clear" test');
});

qtest('map toString', function (assert) {
    var map = new Map();
    assert.equal(map.toString(), '[Map]', 'Map toString');
    assert.equal(mx.iter(map).toString(), '[Map Iterator]', 'Map iterator toString');
});

})));

