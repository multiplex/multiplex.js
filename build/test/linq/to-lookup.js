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

    qmodule('linq-to-lookup');

    function identity(t) {
        return t;
    }


    qtest('basic "to-lookup" tests', function (assert) {
        var lookup = mx__default['default'](array).toLookup(identity);

        assert.ok(lookup.count() === array.length, 'Test toLookup numbers in an array');
        assert.ok(lookup.contains(1), 'Test keys of toLookup method in an array');
        assert.ok(lookup.get(1), 'Test values of toLookup method in an array');
        assert.ok(mx__default['default']([]).toLookup(identity).count() === 0, 'Test toLookup in an empty array');
    });


    qtest('equalityComparer "to-lookup" test', function (assert) {
        var comparer = {
            hash: function (o) {
                return o.val;
            },
            equals: function (a, b) {
                return a.val === b.val && a.index === b.index;
            }
        };

        assert.equal(mx__default['default']([{ val: 1, index: 1 }, { val: 1, index: 2 }])
            .toLookup(identity, identity, comparer).count(), 2, 'Test toLookup an array of objects with equality comparer');
    });


    qtest('hash/equals override "to-lookup" test', function (assert) {
        assert.equal(mx__default['default']([new Basic(1, 'A'), new Basic(2, 'B'), new Basic(1, 'C')])
            .toLookup(identity).count(), 3, 'Test toLookup in an array of objects overriding hash/equals methods');
    });


    qtest('collections "to-lookup" method tests', function (assert) {
        var len = array.length;

        assert.equal(mx__default['default'](array).toLookup(identity).count(), len, 'Test toLookup in an array');
        assert.equal(mx__default['default'](array).toLookup(identity, identity).count(), len, 'Test toLookup in an array with key and value selector');

        assert.equal(enumerable.toLookup(identity).count(), len, 'Test toLookup in an enumerable');
        assert.equal(enumerable.toLookup(identity, identity).count(), len, 'Test toLookup in an enumerable with key and value selector');

        assert.equal(collection.toLookup(identity).count(), len, 'Test toLookup in a Collection');
        assert.equal(collection.toLookup(identity, identity).count(), len, 'Test toLookup in a Collection with key and value selector');

        assert.equal(list.toLookup(identity).count(), len, 'Test toLookup in a List');
        assert.equal(list.toLookup(identity, identity).count(), len, 'Test toLookup in a List with key and value selector');

        assert.equal(readOnlyCollection.toLookup(identity).count(), len, 'Test toLookup in a ReadOnlyCollection');
        assert.equal(readOnlyCollection.toLookup(identity, identity).count(), len, 'Test toLookup in a ReadOnlyCollection with key and value selector');

        assert.equal(linkedList.toLookup(identity).count(), len, 'Test toLookup in a LinkedList');
        assert.equal(linkedList.toLookup(identity, identity).count(), len, 'Test toLookup in a LinkedList with key and value selector');

        assert.equal(hashSet.toLookup(identity).count(), len, 'Test toLookup in a HashSet');
        assert.equal(hashSet.toLookup(identity, identity).count(), len, 'Test toLookup in a HashSet with key and value selector');

        assert.equal(stack.toLookup(identity).count(), len, 'Test toLookup in a Stack');
        assert.equal(stack.toLookup(identity, identity).count(), len, 'Test toLookup in a Stack with key and value selector');

        assert.equal(queue.toLookup(identity).count(), len, 'Test toLookup in a Queue');
        assert.equal(queue.toLookup(identity, identity).count(), len, 'Test toLookup in a Queue with key and value selector');

        assert.equal(set.toLookup(identity).count(), len, 'Test toLookup in a Set');
        assert.equal(set.toLookup(identity, identity).count(), len, 'Test toLookup in a Set with key and value selector');

        assert.equal(map.toLookup(identity).count(), len, 'Test toLookup in a Map');
        assert.equal(map.toLookup(identity, identity).count(), len, 'Test toLookup in a Map with key and value selector');

        assert.equal(dictionary.toLookup(identity).count(), len, 'Test toLookup in a Dictionary');
        assert.equal(dictionary.toLookup(identity, identity).count(), len, 'Test toLookup in a Dictionary with key and value selector');

        assert.equal(lookup.toLookup(identity).count(), len, 'Test toLookup in a Lookup');
        assert.equal(lookup.toLookup(identity, identity).count(), len, 'Test toLookup in a Lookup with key and value selector');

        assert.equal(sortedList.toLookup(identity).count(), len, 'Test toLookup in a SortedList');
        assert.equal(sortedList.toLookup(identity, identity).count(), len, 'Test toLookup in a SortedList with key and value selector');
    });



    qtest('"to-lookup" method validations', function (assert) {
        assert.throws(function () {
            mx__default['default']([1]).toLookup();
        }, 'without key selector');

        assert.throws(function () {
            mx__default['default']([1]).toLookup(1);
        }, 'non-function key selector');

        assert.throws(function () {
            mx__default['default']([1]).toLookup(identity, 1);
        }, 'non-function value selector');
    });

})));

