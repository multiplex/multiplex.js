(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var array = [1, 2, 3, 4, 5];
    var enumerable = mx__default['default'].range(1, 5);
    new mx__default['default'].Collection(array);
    var list = new mx__default['default'].List(array);
    new mx__default['default'].LinkedList(array);
    new mx__default['default'].HashSet(array);
    new mx__default['default'].Stack(array);
    new mx__default['default'].Queue(array);
    new mx__default['default'].Set(array);
    var map = new mx__default['default'].Map();
    var dictionary = new mx__default['default'].Dictionary();
    var sortedList = new mx__default['default'].SortedList();
    list.asReadOnly();
    new mx__default['default'].Lookup(array, function (t) {
        return t;
    });

    for (var i = 0; i < array.length; i++) {
        map.set(array[i], array[i]);
        dictionary.set(array[i], array[i]);
        sortedList.add(array[i], array[i]);
    }

    var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
    var qmodule = qunit.module;
    var qtest = qunit.test;
    qunit.expect;

    qmodule('linq-order-by-descending');

    function identity(t) {
        return t;
    }

    qtest('basic "order-by-descending" tests', function (assert) {
        assert.equal(mx__default['default'].range(0, 50).orderByDescending(identity).toArray()[0], 49, 'Test orderByDescending for array of numbers');
        assert.equal(mx__default['default']('string').orderByDescending(identity).last(), 'g', 'Test orderByDescending for array of string');

        assert.deepEqual(mx__default['default']([{ a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }])
            .orderByDescending(function (t) {
                return t.a;
            })
            .thenBy(function (t) {
                return t.b;
            })
            .thenByDescending(function (t) {
                return t.c;
            })
            .toArray(), [{ a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }, { a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }], 'Test orderByDescending for array of objects');
    });


    qtest('collections "order-by-descending" method tests', function (assert) {
        assert.equal(enumerable.orderByDescending(identity).last(), 1, 'Test orderByDescending for an enumerable');
    });


    qtest('"order-by-descending" toString tests', function (assert) {
        assert.equal(enumerable.orderByDescending(identity).toString(), '[Ordered Iterable]', 'Test orderByDescending toString');
    });

})));

