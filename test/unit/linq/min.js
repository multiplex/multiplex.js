import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-min');

function double(t) {
    return t * 2;
}

qtest('basic "min" test', function (assert) {
    assert.equal(mx(mocks.array).min(), 1, 'min element of an array of numbers');
    assert.equal(mx(mocks.array).min(double), 2, 'min element of an array of numbers with selector');

    assert.equal(mx('test').min(), 'e', 'min element of an array of strings');
    assert.equal(mx([true, false, true]).min(), false, 'min element of an array of boolean');
    assert.equal(mx([new Date(2017, 1, 1), new Date(2018, 1, 1), new Date(2016, 1, 1)]).min().getFullYear(), 2016, 'min element of an array of dates');

    var data1 = [
        {
            val: 2,
            __cmp__: function (b) {
                return this.val - b.val;
            }
        },
        {
            val: 3,
            __cmp__: function (b) {
                return this.val - b.val;
            }
        },
        {
            val: 1,
            __cmp__: function (b) {
                return this.val - b.val;
            }
        }
    ];

    var data2 = [
        {
            val: 2,
            valueOf: function () {
                return this.val;
            }
        },
        {
            val: 3,
            valueOf: function () {
                return this.val;
            }
        },
        {
            val: 1,
            valueOf: function () {
                return this.val;
            }
        }
    ];

    assert.equal(mx(data1).min().val, 1, 'min element of an array of objects with __cmp__ method');
    assert.equal(mx(data2).min().val, 1, 'min element of an array of objects with valueOf method');
});



qtest('collections "min" method tests', function (assert) {
    assert.equal(mocks.collection.min(), 1, 'min element in a Collection');
    assert.equal(mocks.collection.min(double), 2, 'min element in a Collection with predicate');

    assert.equal(mocks.list.min(), 1, 'min element in a List');
    assert.equal(mocks.list.min(double), 2, 'min element in a List with predicate');

    assert.equal(mocks.readOnlyCollection.min(), 1, 'min element in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.min(double), 2, 'min element in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.min(), 1, 'min element in a LinkedList');
    assert.equal(mocks.linkedList.min(double), 2, 'min element in a LinkedList with predicate');

    assert.equal(mocks.hashSet.min(), 1, 'min element in a HashSet');
    assert.equal(mocks.hashSet.min(double), 2, 'min element in a HashSet with predicate');

    assert.equal(mocks.stack.min(), 1, 'min element in a Stack');
    assert.equal(mocks.stack.min(double), 2, 'min element in a Stack with predicate');

    assert.equal(mocks.queue.min(), 1, 'min element in a Queue');
    assert.equal(mocks.queue.min(double), 2, 'min element in a Queue with predicate');

    assert.equal(mocks.set.min(), 1, 'min element in a Set');
    assert.equal(mocks.set.min(double), 2, 'min element in a Set with predicate');

    assert.equal(mocks.map.min(function (t) {
        return t[0];
    }), 1, 'min element in a Map');

    assert.equal(mocks.dictionary.min(function (t) {
        return t.key;
    }), 1, 'min element in a Dictionary');

    assert.equal(mocks.lookup.min(function (t) {
        return t.key;
    }), 1, 'min element in a Lookup');

    assert.equal(mocks.sortedList.min(function (t) {
        return t.key;
    }), 1, 'min element in a SortedList');
});



qtest('"min" method validations', function (assert) {
    assert.throws(function () {
        mx([]).min();
    }, 'empty collection');

    assert.throws(function () {
        mx([1]).min(1);
    }, 'non function selector');
});