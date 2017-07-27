import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-except');


qtest('basic "except" test', function (assert) {
    assert.deepEqual(mx([]).except([]).toArray(), [], 'except two empty arrays');
    assert.deepEqual(mx([1, 2]).except([]).toArray(), [1, 2], 'except an array with empty array');
    assert.deepEqual(mx([1, 2]).except([3, 4]).toArray(), [1, 2], 'except two arrays');
    assert.deepEqual(mx([1, 2]).except([1, 2]).toArray(), [], 'except two identical arrays');
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

    assert.equal(mx([{ val: 1, index: 1 }]).except([{ val: 1, index: 2 }], comparer).toArray().length, 0, 'Test except in an array of objects with equality comparer');
    assert.equal(mx([{ val: 1, index: 1 }]).except([{ val: 2, index: 2 }], comparer).toArray().length, 1, 'Test except an array of objects with equality comparer');
});


qtest('hash/equals override "except" test', function (assert) {
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).except([new mocks.Basic(1, 'C')]).toArray().length, 1, 'Test except in an array of objects overriding hash/equals methods');
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).except([new mocks.Basic(3, 'A')]).toArray().length, 2, 'Test except in an array of objects overriding hash/equals methods');
});


qtest('collections "except" method tests', function (assert) {
    var len = mocks.array.length;

    assert.equal(mocks.enumerable.except([]).toArray().length, len, 'Test "except" with an empty array in an enumerable');
    assert.equal(mocks.enumerable.except(mocks.enumerable).toArray().length, 0, 'Test "except" in an enumerable');

    assert.equal(mocks.collection.except([]).toArray().length, len, 'Test "except" with an empty array in a Collection');
    assert.equal(mocks.collection.except(mocks.collection).toArray().length, 0, 'Test "except" in a Collection');

    assert.equal(mocks.list.except([]).toArray().length, len, 'Test "except" with an empty array in a List');
    assert.equal(mocks.list.except(mocks.collection).toArray().length, 0, 'Test "except" in a List');

    assert.equal(mocks.readOnlyCollection.except([]).toArray().length, len, 'Test "except" with an empty array in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.except(mocks.collection).toArray().length, 0, 'Test "except" in a ReadOnlyCollection');

    assert.equal(mocks.linkedList.except([]).toArray().length, len, 'Test "except" with an empty array in a LinkedList');
    assert.equal(mocks.linkedList.except(mocks.collection).toArray().length, 0, 'Test "except" in a LinkedList');

    assert.equal(mocks.hashSet.except([]).toArray().length, len, 'Test "except" with an empty array in a HashSet');
    assert.equal(mocks.hashSet.except(mocks.collection).toArray().length, 0, 'Test "except" in a HashSet');

    assert.equal(mocks.stack.except([]).toArray().length, len, 'Test "except" with an empty array in a Stack');
    assert.equal(mocks.stack.except(mocks.collection).toArray().length, 0, 'Test "except" in a Stack');

    assert.equal(mocks.queue.except([]).toArray().length, len, 'Test "except" with an empty array in a Queue');
    assert.equal(mocks.queue.except(mocks.collection).toArray().length, 0, 'Test "except" in a Queue');

    assert.equal(mocks.set.except([]).toArray().length, len, 'Test "except" with an empty array in a Set');
    assert.equal(mocks.set.except(mocks.set).toArray().length, 0, 'Test "except" in a Set');

    assert.equal(mocks.map.except([]).toArray().length, len, 'Test "except" with an empty array in a Map');
    assert.equal(mocks.map.except(mocks.map).toArray().length, len, 'Test "except" in a Map');

    assert.equal(mocks.dictionary.except([]).toArray().length, len, 'Test "except" with an empty array in a Dictionary');
    assert.equal(mocks.dictionary.except(mocks.dictionary).toArray().length, 0, 'Test "except" in a Dictionary');

    assert.equal(mocks.lookup.except([]).toArray().length, len, 'Test "except" with an empty array in a Lookup');
    assert.equal(mocks.lookup.except(mocks.lookup).toArray().length, 0, 'Test "except" in a Lookup');

    assert.equal(mocks.sortedList.except([]).toArray().length, len, 'Test "except" with an empty array in a SortedList');
    assert.equal(mocks.sortedList.except(mocks.sortedList).toArray().length, 0, 'Test "except" in a SortedList');
});


qtest('except method validations', function (assert) {
    assert.throws(function () {
        mx([1]).except();
    }, 'null input');
});
