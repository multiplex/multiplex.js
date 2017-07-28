import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-union');


qtest('basic "union" test', function (assert) {
    assert.deepEqual(mx([]).union([]).toArray(), [], 'union two empty arrays');
    assert.deepEqual(mx([1, 2]).union([]).toArray(), [1, 2], 'union an array with empty array');
    assert.deepEqual(mx([1, 2]).union([3, 4]).toArray(), [1, 2, 3, 4], 'union two arrays');
    assert.deepEqual(mx([1, 2]).union([1, 2]).toArray(), [1, 2], 'union two identical arrays');
});


qtest('equalityComparer "union" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val;
        }
    };

    assert.equal(mx([{ val: 1, index: 1 }]).union([{ val: 1, index: 2 }], comparer).toArray().length, 1, 'Test union in an array of objects with equality comparer');
    assert.equal(mx([{ val: 1, index: 1 }]).union([{ val: 2, index: 2 }], comparer).toArray().length, 2, 'Test union an array of objects with equality comparer');
});


qtest('hash/equals override "union" test', function (assert) {
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).union([new mocks.Basic(1, 'A')]).toArray().length, 2, 'Test union in an array of objects overriding hash/equals methods');
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).union([new mocks.Basic(3, 'A')]).toArray().length, 3, 'Test union in an array of objects overriding hash/equals methods');
});


qtest('collections "union" method tests', function (assert) {
    var len = mocks.array.length;

    assert.equal(mocks.enumerable.union([]).toArray().length, len, 'Test "union" with an empty array in an enumerable');
    assert.equal(mocks.enumerable.union(mocks.enumerable).toArray().length, len, 'Test "union" in an enumerable');

    assert.equal(mocks.collection.union([]).toArray().length, len, 'Test "union" with an empty array in a Collection');
    assert.equal(mocks.collection.union(mocks.collection).toArray().length, len, 'Test "union" in a Collection');

    assert.equal(mocks.list.union([]).toArray().length, len, 'Test "union" with an empty array in a List');
    assert.equal(mocks.list.union(mocks.collection).toArray().length, len, 'Test "union" in a List');

    assert.equal(mocks.readOnlyCollection.union([]).toArray().length, len, 'Test "union" with an empty array in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.union(mocks.collection).toArray().length, len, 'Test "union" in a ReadOnlyCollection');

    assert.equal(mocks.linkedList.union([]).toArray().length, len, 'Test "union" with an empty array in a LinkedList');
    assert.equal(mocks.linkedList.union(mocks.collection).toArray().length, len, 'Test "union" in a LinkedList');

    assert.equal(mocks.hashSet.union([]).toArray().length, len, 'Test "union" with an empty array in a HashSet');
    assert.equal(mocks.hashSet.union(mocks.collection).toArray().length, len, 'Test "union" in a HashSet');

    assert.equal(mocks.stack.union([]).toArray().length, len, 'Test "union" with an empty array in a Stack');
    assert.equal(mocks.stack.union(mocks.collection).toArray().length, len, 'Test "union" in a Stack');

    assert.equal(mocks.queue.union([]).toArray().length, len, 'Test "union" with an empty array in a Queue');
    assert.equal(mocks.queue.union(mocks.collection).toArray().length, len, 'Test "union" in a Queue');

    assert.equal(mocks.set.union([]).toArray().length, len, 'Test "union" with an empty array in a Set');
    assert.equal(mocks.set.union(mocks.set).toArray().length, len, 'Test "union" in a Set');

    assert.equal(mocks.map.union([]).toArray().length, len, 'Test "union" with an empty array in a Map');
    assert.equal(mocks.map.union(mocks.map).toArray().length, 2 * len, 'Test "union" in a Map');

    assert.equal(mocks.dictionary.union([]).toArray().length, len, 'Test "union" with an empty array in a Dictionary');
    assert.equal(mocks.dictionary.union(mocks.dictionary).toArray().length, len, 'Test "union" in a Dictionary');

    assert.equal(mocks.lookup.union([]).toArray().length, len, 'Test "union" with an empty array in a Lookup');
    assert.equal(mocks.lookup.union(mocks.lookup).toArray().length, len, 'Test "union" in a Lookup');

    assert.equal(mocks.sortedList.union([]).toArray().length, len, 'Test "union" with an empty array in a SortedList');
    assert.equal(mocks.sortedList.union(mocks.sortedList).toArray().length, len, 'Test "union" in a SortedList');
});


qtest('union method validations', function (assert) {
    assert.throws(function () {
        mx([1]).union();
    }, 'null input');
});
