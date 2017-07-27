import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-intersect');


qtest('basic "intersect" test', function (assert) {
    assert.deepEqual(mx([]).intersect([]).toArray(), [], 'intersect two empty arrays');
    assert.deepEqual(mx([1, 2]).intersect([]).toArray(), [], 'intersect an array with empty array');
    assert.deepEqual(mx([1, 2]).intersect([3, 4]).toArray(), [], 'intersect two arrays');
    assert.deepEqual(mx([1, 2]).intersect([1, 2]).toArray(), [1, 2], 'intersect two identical arrays');
    assert.deepEqual(mx([1, 2, 3, 4]).intersect([3, 4, 5, 6]).toArray(), [3, 4], 'intersect two arrays');
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

    assert.equal(mx([{ val: 1, index: 1 }]).intersect([{ val: 1, index: 2 }], comparer).toArray().length, 1, 'Test intersect in an array of objects with equality comparer');
    assert.equal(mx([{ val: 1, index: 1 }]).intersect([{ val: 2, index: 2 }], comparer).toArray().length, 0, 'Test intersect an array of objects with equality comparer');
});


qtest('hash/equals override "intersect" test', function (assert) {
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).intersect([new mocks.Basic(1, 'C')]).toArray().length, 1, 'Test intersect in an array of objects overriding hash/equals methods');
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).intersect([new mocks.Basic(3, 'A')]).toArray().length, 0, 'Test intersect in an array of objects overriding hash/equals methods');
});


qtest('collections "intersect" method tests', function (assert) {
    var len = mocks.array.length;

    assert.equal(mocks.enumerable.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in an enumerable');
    assert.equal(mocks.enumerable.intersect(mocks.enumerable).toArray().length, len, 'Test "intersect" in an enumerable');

    assert.equal(mocks.collection.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Collection');
    assert.equal(mocks.collection.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a Collection');

    assert.equal(mocks.list.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a List');
    assert.equal(mocks.list.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a List');

    assert.equal(mocks.readOnlyCollection.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a ReadOnlyCollection');

    assert.equal(mocks.linkedList.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a LinkedList');
    assert.equal(mocks.linkedList.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a LinkedList');

    assert.equal(mocks.hashSet.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a HashSet');
    assert.equal(mocks.hashSet.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a HashSet');

    assert.equal(mocks.stack.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Stack');
    assert.equal(mocks.stack.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a Stack');

    assert.equal(mocks.queue.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Queue');
    assert.equal(mocks.queue.intersect(mocks.collection).toArray().length, len, 'Test "intersect" in a Queue');

    assert.equal(mocks.set.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Set');
    assert.equal(mocks.set.intersect(mocks.set).toArray().length, len, 'Test "intersect" in a Set');

    assert.equal(mocks.map.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Map');
    assert.equal(mocks.map.intersect(mocks.map).toArray().length, 0, 'Test "intersect" in a Map');

    assert.equal(mocks.dictionary.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Dictionary');
    assert.equal(mocks.dictionary.intersect(mocks.dictionary).toArray().length, len, 'Test "intersect" in a Dictionary');

    assert.equal(mocks.lookup.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a Lookup');
    assert.equal(mocks.lookup.intersect(mocks.lookup).toArray().length, len, 'Test "intersect" in a Lookup');

    assert.equal(mocks.sortedList.intersect([]).toArray().length, 0, 'Test "intersect" with an empty array in a SortedList');
    assert.equal(mocks.sortedList.intersect(mocks.sortedList).toArray().length, len, 'Test "intersect" in a SortedList');
});


qtest('intersect method validations', function (assert) {
    assert.throws(function () {
        mx([1]).intersect();
    }, 'null input');
});
