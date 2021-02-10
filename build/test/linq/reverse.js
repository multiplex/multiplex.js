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

    qmodule('linq-reverse');

    var reversed = array.concat().reverse();


    qtest('basic "reverse" test', function (assert) {
        assert.equal(mx__default['default']([]).reverse().count(), 0, 'reverse of an empty array');
        assert.deepEqual(mx__default['default'](array).reverse().toArray(), reversed, 'reverse of an array of numbers');
        assert.deepEqual(mx__default['default']('abcd').reverse().toArray(), ['d', 'c', 'b', 'a'], 'reverse of an array of string');
        assert.deepEqual(mx__default['default']([true, false, false]).reverse().toArray(), [false, false, true], 'reverse of an array of booleans');
        assert.deepEqual(mx__default['default']([new Date(2016, 1, 1), new Date(2017, 1, 1), new Date(2018, 1, 1)]).reverse().toArray(), [new Date(2018, 1, 1), new Date(2017, 1, 1), new Date(2016, 1, 1)], 'reverse of an array of date');
    });


    qtest('collections "reverse" method tests', function (assert) {
        assert.deepEqual(enumerable.reverse().toArray(), reversed, 'Test "reverse" in an enumerable');
        assert.deepEqual(collection.reverse().toArray(), reversed, 'Test "reverse" in a Collection');
        assert.deepEqual(list.reverse().toArray(), reversed, 'Test "reverse" in a List');
        assert.deepEqual(readOnlyCollection.reverse().toArray(), reversed, 'Test "reverse" in a ReadOnlyCollection');
        assert.deepEqual(linkedList.reverse().toArray(), reversed, 'Test "reverse" in a LinkedList');
        assert.deepEqual(hashSet.reverse().toArray(), reversed, 'Test "reverse" in a HashSet');
        assert.deepEqual(stack.reverse().toArray(), reversed, 'Test "reverse" in a Stack');
        assert.deepEqual(queue.reverse().toArray(), reversed, 'Test "reverse" in a Queue');
        assert.deepEqual(set.reverse().toArray(), reversed, 'Test "reverse" in a Set');

        assert.equal(map.reverse().toArray()[0][0], 5, 'Test "reverse" in a Map');
        assert.equal(dictionary.reverse().toArray()[0].key, 5, 'Test "reverse" in a Dictionary');
        assert.equal(lookup.reverse().toArray()[0].key, 5, 'Test "reverse" in a Lookup');
        assert.equal(sortedList.reverse().toArray()[0].key, 5, 'Test "reverse" in a SortedList');
    });

})));

