(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var array = [1, 2, 3, 4, 5];
    mx__default['default'].range(1, 5);
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

    qmodule('linq-group-by');

    function identity(t) {
        return t;
    }

    qtest('basic group-by test', function (assert) {
        var grp = mx__default['default'](array).groupBy(identity, identity);
        var grp1 = grp.first();

        assert.equal(grp.count(), array.length, 'Test groupBy numbers in an array are less than 10');

        assert.equal(grp1.count(), 1, 'Test grouping count');
        assert.equal(grp1.toArray().length, 1, 'Test grouping toArray');
        assert.equal(grp1.toString(), '[Grouping]', 'Test grouping toString');
    });

})));

