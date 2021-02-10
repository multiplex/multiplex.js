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

    function Basic(val, name) {
        this.val = val;
        this.name = name;
    }

    Basic.prototype.__hash__ = function () {
        return this.val;
    };

    Basic.prototype.__eq__ = function (obj) {
        return this.val === obj.val && this.name === obj.name;
    };

    var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
    var qmodule = qunit.module;
    var qtest = qunit.test;
    qunit.expect;

    qmodule('linq-except');


    qtest('basic "except" test', function (assert) {
        assert.deepEqual(mx__default['default']([]).except([]).toArray(), [], 'except two empty arrays');
        assert.deepEqual(mx__default['default']([1, 2]).except([]).toArray(), [1, 2], 'except an array with empty array');
        assert.deepEqual(mx__default['default']([1, 2]).except([3, 4]).toArray(), [1, 2], 'except two arrays');
        assert.deepEqual(mx__default['default']([1, 2]).except([1, 2]).toArray(), [], 'except two identical arrays');
    });


    qtest('equalityComparer "except" test', function (assert) {
        var comparer = {
            hash: function (o) {
                return o.val;
            },
            equals: function (a, b) {
                return a.val === b.val;
            }
        };

        assert.equal(mx__default['default']([{ val: 1, index: 1 }]).except([{ val: 1, index: 2 }], comparer).toArray().length, 0, 'Test except in an array of objects with equality comparer');
        assert.equal(mx__default['default']([{ val: 1, index: 1 }]).except([{ val: 2, index: 2 }], comparer).toArray().length, 1, 'Test except an array of objects with equality comparer');
    });


    qtest('hash/equals override "except" test', function (assert) {
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B')]).except([new Basic(1, 'A')]).toArray().length, 1, 'Test except in an array of objects overriding hash/equals methods');
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B')]).except([new Basic(1, 'B')]).toArray().length, 2, 'Test except in an array of objects overriding hash/equals methods');
    });


    qtest('collections "except" method tests', function (assert) {
        var len = array.length;

        assert.equal(enumerable.except([]).toArray().length, len, 'Test "except" with an empty array in an enumerable');
        assert.equal(enumerable.except(enumerable).toArray().length, 0, 'Test "except" in an enumerable');

        assert.equal(collection.except([]).toArray().length, len, 'Test "except" with an empty array in a Collection');
        assert.equal(collection.except(collection).toArray().length, 0, 'Test "except" in a Collection');

        assert.equal(list.except([]).toArray().length, len, 'Test "except" with an empty array in a List');
        assert.equal(list.except(collection).toArray().length, 0, 'Test "except" in a List');

        assert.equal(readOnlyCollection.except([]).toArray().length, len, 'Test "except" with an empty array in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.except(collection).toArray().length, 0, 'Test "except" in a ReadOnlyCollection');

        assert.equal(linkedList.except([]).toArray().length, len, 'Test "except" with an empty array in a LinkedList');
        assert.equal(linkedList.except(collection).toArray().length, 0, 'Test "except" in a LinkedList');

        assert.equal(hashSet.except([]).toArray().length, len, 'Test "except" with an empty array in a HashSet');
        assert.equal(hashSet.except(collection).toArray().length, 0, 'Test "except" in a HashSet');

        assert.equal(stack.except([]).toArray().length, len, 'Test "except" with an empty array in a Stack');
        assert.equal(stack.except(collection).toArray().length, 0, 'Test "except" in a Stack');

        assert.equal(queue.except([]).toArray().length, len, 'Test "except" with an empty array in a Queue');
        assert.equal(queue.except(collection).toArray().length, 0, 'Test "except" in a Queue');

        assert.equal(set.except([]).toArray().length, len, 'Test "except" with an empty array in a Set');
        assert.equal(set.except(set).toArray().length, 0, 'Test "except" in a Set');

        assert.equal(map.except([]).toArray().length, len, 'Test "except" with an empty array in a Map');
        assert.equal(map.except(map).toArray().length, len, 'Test "except" in a Map');

        assert.equal(dictionary.except([]).toArray().length, len, 'Test "except" with an empty array in a Dictionary');
        assert.equal(dictionary.except(dictionary).toArray().length, 0, 'Test "except" in a Dictionary');

        assert.equal(lookup.except([]).toArray().length, len, 'Test "except" with an empty array in a Lookup');
        assert.equal(lookup.except(lookup).toArray().length, 0, 'Test "except" in a Lookup');

        assert.equal(sortedList.except([]).toArray().length, len, 'Test "except" with an empty array in a SortedList');
        assert.equal(sortedList.except(sortedList).toArray().length, 0, 'Test "except" in a SortedList');
    });


    qtest('except method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).except();
        }, 'null input');
    });

})));

