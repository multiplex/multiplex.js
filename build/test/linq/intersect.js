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

    qmodule('linq-intersect');


    qtest('basic "intersect" test', function (assert) {
        assert.deepEqual(mx__default['default']([]).intersect([]).toArray(), [], 'intersect two empty arrays');
        assert.deepEqual(mx__default['default']([1, 2]).intersect([]).toArray(), [], 'intersect an array with empty array');
        assert.deepEqual(mx__default['default']([1, 2]).intersect([3, 4]).toArray(), [], 'intersect two arrays');
        assert.deepEqual(mx__default['default']([1, 2]).intersect([1, 2]).toArray(), [1, 2], 'intersect two identical arrays');
        assert.deepEqual(mx__default['default']([1, 2, 3, 4]).intersect([3, 4, 5, 6]).toArray(), [3, 4], 'intersect two arrays');
    });


    qtest('equalityComparer "intersect" test', function (assert) {
        var comparer = {
            hash: function (o) {
                return o.val;
            },
            equals: function (a, b) {
                return a.val === b.val;
            }
        };

        assert.equal(mx__default['default']([{ val: 1, index: 1 }]).intersect([{ val: 1, index: 2 }], comparer).toArray().length, 1, 'Test intersect in an array of objects with equality comparer');
        assert.equal(mx__default['default']([{ val: 1, index: 1 }]).intersect([{ val: 2, index: 2 }], comparer).toArray().length, 0, 'Test intersect an array of objects with equality comparer');
    });


    qtest('hash/equals override "intersect" test', function (assert) {
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B')]).intersect([new Basic(1, 'A')]).toArray().length, 1, 'Test intersect in an array of objects overriding hash/equals methods');
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B')]).intersect([new Basic(1, 'B')]).toArray().length, 0, 'Test intersect in an array of objects overriding hash/equals methods');
    });


    qtest('collections "intersect" method tests', function (assert) {
        var len = array.length;

        assert.equal(enumerable.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in an enumerable');
        assert.equal(enumerable.intersect(enumerable).toArray().length, len, 'Test "intersect" in an enumerable');

        assert.equal(collection.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Collection');
        assert.equal(collection.intersect(collection).toArray().length, len, 'Test "intersect" in a Collection');

        assert.equal(list.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a List');
        assert.equal(list.intersect(collection).toArray().length, len, 'Test "intersect" in a List');

        assert.equal(readOnlyCollection.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.intersect(collection).toArray().length, len, 'Test "intersect" in a ReadOnlyCollection');

        assert.equal(linkedList.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a LinkedList');
        assert.equal(linkedList.intersect(collection).toArray().length, len, 'Test "intersect" in a LinkedList');

        assert.equal(hashSet.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a HashSet');
        assert.equal(hashSet.intersect(collection).toArray().length, len, 'Test "intersect" in a HashSet');

        assert.equal(stack.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Stack');
        assert.equal(stack.intersect(collection).toArray().length, len, 'Test "intersect" in a Stack');

        assert.equal(queue.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Queue');
        assert.equal(queue.intersect(collection).toArray().length, len, 'Test "intersect" in a Queue');

        assert.equal(set.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Set');
        assert.equal(set.intersect(set).toArray().length, len, 'Test "intersect" in a Set');

        assert.equal(map.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Map');
        assert.equal(map.intersect(map).toArray().length, 0, 'Test "intersect" in a Map');

        assert.equal(dictionary.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Dictionary');
        assert.equal(dictionary.intersect(dictionary).toArray().length, len, 'Test "intersect" in a Dictionary');

        assert.equal(lookup.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Lookup');
        assert.equal(lookup.intersect(lookup).toArray().length, len, 'Test "intersect" in a Lookup');

        assert.equal(sortedList.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a SortedList');
        assert.equal(sortedList.intersect(sortedList).toArray().length, len, 'Test "intersect" in a SortedList');
    });


    qtest('intersect method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).intersect();
        }, 'null input');
    });

})));

