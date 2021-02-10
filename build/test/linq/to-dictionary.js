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

    qmodule('linq-to-dictionary');

    function identity(t) {
        return t;
    }


    qtest('basic "to-dictionary" tests', function (assert) {
        var dic = mx__default['default'](array).toDictionary(identity);

        assert.ok(dic.count() === array.length, 'Test toDictionary numbers in an array');
        assert.ok(dic.keys().count() === array.length, 'Test toDictionary keys count in an array');
        assert.ok(dic.values().count() === array.length, 'Test toDictionary values count in an array');
        assert.ok(dic.containsKey(1), 'Test keys of toDictionary method in an array');
        assert.ok(dic.containsValue(1), 'Test values of toDictionary method in an array');
        assert.ok(!dic.containsKey('a'), 'Test not exsiatnce of the values of toDictionary method in an array');
        assert.ok(mx__default['default']([]).toDictionary(identity).count() === 0, 'Test toDictionary in an empty array');
    });


    qtest('equalityComparer "to-dictionary" test', function (assert) {
        var comparer = {
            hash: function (o) {
                return o.val;
            },
            equals: function (a, b) {
                return a.val === b.val && a.index === b.index;
            }
        };

        assert.equal(mx__default['default']([{ val: 1, index: 1 }, { val: 1, index: 2 }])
            .toDictionary(identity, identity, comparer).count(), 2, 'Test toDictionary an array of objects with equality comparer');
    });


    qtest('hash/equals override "to-dictionary" test', function (assert) {
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B'), new Basic(1, 'C')])
            .toDictionary(identity).count(), 3, 'Test toDictionary in an array of objects overriding hash/equals methods');
    });


    qtest('collections "to-dictionary" method tests', function (assert) {
        var len = array.length;

        assert.equal(mx__default['default'](array).toDictionary(identity).count(), len, 'Test toDictionary in an array');
        assert.equal(mx__default['default'](array).toDictionary(identity, identity).count(), len, 'Test toDictionary in an array with key and value selector');

        assert.equal(enumerable.toDictionary(identity).count(), len, 'Test toDictionary in an enumerable');
        assert.equal(enumerable.toDictionary(identity, identity).count(), len, 'Test toDictionary in an enumerable with key and value selector');

        assert.equal(collection.toDictionary(identity).count(), len, 'Test toDictionary in a Collection');
        assert.equal(collection.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Collection with key and value selector');

        assert.equal(list.toDictionary(identity).count(), len, 'Test toDictionary in a List');
        assert.equal(list.toDictionary(identity, identity).count(), len, 'Test toDictionary in a List with key and value selector');

        assert.equal(readOnlyCollection.toDictionary(identity).count(), len, 'Test toDictionary in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.toDictionary(identity, identity).count(), len, 'Test toDictionary in a ReadOnlyCollection with key and value selector');

        assert.equal(linkedList.toDictionary(identity).count(), len, 'Test toDictionary in a LinkedList');
        assert.equal(linkedList.toDictionary(identity, identity).count(), len, 'Test toDictionary in a LinkedList with key and value selector');

        assert.equal(hashSet.toDictionary(identity).count(), len, 'Test toDictionary in a HashSet');
        assert.equal(hashSet.toDictionary(identity, identity).count(), len, 'Test toDictionary in a HashSet with key and value selector');

        assert.equal(stack.toDictionary(identity).count(), len, 'Test toDictionary in a Stack');
        assert.equal(stack.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Stack with key and value selector');

        assert.equal(queue.toDictionary(identity).count(), len, 'Test toDictionary in a Queue');
        assert.equal(queue.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Queue with key and value selector');

        assert.equal(set.toDictionary(identity).count(), len, 'Test toDictionary in a Set');
        assert.equal(set.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Set with key and value selector');

        assert.equal(map.toDictionary(identity).count(), len, 'Test toDictionary in a Map');
        assert.equal(map.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Map with key and value selector');

        assert.equal(dictionary.toDictionary(identity).count(), len, 'Test toDictionary in a Dictionary');
        assert.equal(dictionary.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Dictionary with key and value selector');

        assert.equal(lookup.toDictionary(identity).count(), len, 'Test toDictionary in a Lookup');
        assert.equal(lookup.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Lookup with key and value selector');

        assert.equal(sortedList.toDictionary(identity).count(), len, 'Test toDictionary in a SortedList');
        assert.equal(sortedList.toDictionary(identity, identity).count(), len, 'Test toDictionary in a SortedList with key and value selector');
    });



    qtest('toDictionary method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).toDictionary();
        }, 'without key selector');

        assert.throws(function () {
            mx__default['default']([1]).toDictionary(1);
        }, 'non-function key selector');

        assert.throws(function () {
            mx__default['default']([1]).toDictionary(identity, 1);
        }, 'non-function value selector');

        assert.throws(function () {
            mx__default['default']([1, 1]).toDictionary(identity);
        }, 'duplicate keys');
    });

})));

