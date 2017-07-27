import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-max');

function squared(t) {
    return t * t;
}

qtest('basic "max" test', function (assert) {
    assert.equal(mx(mocks.array).max(), 5, 'max element of an array of numbers');
    assert.equal(mx(mocks.array).max(squared), 25, 'max element of an array of numbers with selector');

    assert.equal(mx('test').max(), 't', 'max element of an array of strings');
    assert.equal(mx([true, false, true]).max(), true, 'max element of an array of boolean');
    assert.equal(mx([new Date(2017, 1, 1), new Date(2018, 1, 1), new Date(2016, 1, 1)]).max().getFullYear(), 2018, 'max element of an array of dates');

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

    assert.equal(mx(data1).max().val, 3, 'max element of an array of objects with __cmp__ method');
    assert.equal(mx(data2).max().val, 3, 'max element of an array of objects with valueOf method');
});



qtest('collections "max" method tests', function (assert) {
    assert.equal(mocks.collection.max(), 5, 'max element in a Collection');
    assert.equal(mocks.collection.max(squared), 25, 'max element in a Collection with predicate');

    assert.equal(mocks.list.max(), 5, 'max element in a List');
    assert.equal(mocks.list.max(squared), 25, 'max element in a List with predicate');

    assert.equal(mocks.readOnlyCollection.max(), 5, 'max element in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.max(squared), 25, 'max element in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.max(), 5, 'max element in a LinkedList');
    assert.equal(mocks.linkedList.max(squared), 25, 'max element in a LinkedList with predicate');

    assert.equal(mocks.hashSet.max(), 5, 'max element in a HashSet');
    assert.equal(mocks.hashSet.max(squared), 25, 'max element in a HashSet with predicate');

    assert.equal(mocks.stack.max(), 5, 'max element in a Stack');
    assert.equal(mocks.stack.max(squared), 25, 'max element in a Stack with predicate');

    assert.equal(mocks.queue.max(), 5, 'max element in a Queue');
    assert.equal(mocks.queue.max(squared), 25, 'max element in a Queue with predicate');

    assert.equal(mocks.set.max(), 5, 'max element in a Set');
    assert.equal(mocks.set.max(squared), 25, 'max element in a Set with predicate');

    assert.equal(mocks.map.max(function (t) {
        return t[0];
    }), 5, 'max element in a Map');

    assert.equal(mocks.dictionary.max(function (t) {
        return t.key;
    }), 5, 'max element in a Dictionary');

    assert.equal(mocks.lookup.max(function (t) {
        return t.key;
    }), 5, 'max element in a Lookup');

    assert.equal(mocks.sortedList.max(function (t) {
        return t.key;
    }), 5, 'max element in a SortedList');
});



qtest('"max" method validations', function (assert) {
    assert.throws(function () {
        mx([]).max();
    }, 'empty collection');

    assert.throws(function () {
        mx([1]).max(1);
    }, 'non function selector');
});