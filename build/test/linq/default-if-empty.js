(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var array = [1, 2, 3, 4, 5];
    var enumerable = mx__default['default'].range(1, 5);
    var collection = new mx__default['default'].Collection(array);
    var list = new mx__default['default'].List(array);
    var linkedList = new mx__default['default'].LinkedList(array);
    var hashSet = new mx__default['default'].HashSet(array);
    var stack = new mx__default['default'].Stack(array);
    var queue = new mx__default['default'].Queue(array);
    var set = new mx__default['default'].Set(array);
    var map = new mx__default['default'].Map();
    var dictionary = new mx__default['default'].Dictionary();
    var sortedList = new mx__default['default'].SortedList();
    var readOnlyCollection = list.asReadOnly();
    var lookup = new mx__default['default'].Lookup(array, function (t) {
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

    qmodule('linq-default-if-empty');

    qtest('basic "defaultIfEmpty" test', function (assert) {
        assert.equal(mx__default['default'](array).defaultIfEmpty().count(), 5, 'defaultIfEmpty on a non-empty array');
        assert.equal(mx__default['default']([]).defaultIfEmpty(1).toArray()[0], 1, 'defaultIfEmpty on an empty array');
    });

    qtest('collections "defaultIfEmpty" method tests', function (assert) {
        assert.equal(enumerable.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in an enumerable');
        assert.equal(new mx__default['default'].range(0, 0).defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty enumerable');

        assert.equal(collection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Collection');
        assert.equal(new mx__default['default'].Collection().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Collection');

        assert.equal(list.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a List');
        assert.equal(new mx__default['default'].List().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty List');

        assert.equal(readOnlyCollection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a ReadOnlyCollection');
        assert.equal(new mx__default['default'].ReadOnlyCollection([]).defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty ReadOnlyCollection');

        assert.equal(linkedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a LinkedList');
        assert.equal(new mx__default['default'].LinkedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty LinkedList');

        assert.equal(hashSet.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a HashSet');
        assert.equal(new mx__default['default'].HashSet().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty HashSet');

        assert.equal(stack.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Stack');
        assert.equal(new mx__default['default'].Stack().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Stack');

        assert.equal(queue.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Queue');
        assert.equal(new mx__default['default'].Queue().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Queue');

        assert.equal(set.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Set');
        assert.equal(new mx__default['default'].Set().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Set');

        assert.equal(map.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Map');
        assert.equal(new mx__default['default'].Map().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Map');

        assert.equal(dictionary.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Dictionary');
        assert.equal(lookup.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Lookup');

        assert.equal(sortedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a SortedList');
        assert.equal(new mx__default['default'].SortedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty SortedList');
    });

})));

