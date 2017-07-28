import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-sequence-equal');


qtest('basic "sequenceEqual" test', function (assert) {
    assert.ok(mx([]).sequenceEqual([]), 'sequenceEqual two empty arrays');
    assert.ok(!mx([1, 2]).sequenceEqual([]), 'sequenceEqual an array with empty array');
    assert.ok(!mx([]).sequenceEqual([1, 2]), 'sequenceEqual empty array with an array');
    assert.ok(!mx([1, 2]).sequenceEqual([3, 4]), 'sequenceEqual two arrays');
    assert.ok(mx([1, 2]).sequenceEqual([1, 2]), 'sequenceEqual two identical arrays');

    assert.ok(mx('string').sequenceEqual('string'), 'sequenceEqual two identical strings');
    assert.ok(!mx('string').sequenceEqual('string1'), 'sequenceEqual two identical strings');

    assert.ok(mx([true, false]).sequenceEqual([true, false]), 'sequenceEqual two identical boolean');
    assert.ok(!mx([true, false]).sequenceEqual([false, true]), 'sequenceEqual two identical boolean');

    assert.ok(mx([new Date(2017, 1, 1)]).sequenceEqual([new Date(2017, 1, 1)]), 'sequenceEqual two identical dates');
    assert.ok(!mx([new Date(2017, 1, 1)]).sequenceEqual([new Date(2016, 1, 1)]), 'sequenceEqual two identical dates');
});


qtest('equalityComparer "sequenceEqual" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val;
        }
    };

    comparer.hash(1);
    assert.ok(mx([{ val: 1, index: 1 }]).sequenceEqual([{ val: 1, index: 2 }], comparer), 'Test sequenceEqual in an array of objects with equality comparer');
    assert.ok(!mx([{ val: 1, index: 1 }]).sequenceEqual([{ val: 2, index: 2 }], comparer), 'Test sequenceEqual an array of objects with equality comparer');
});


qtest('hash/equals override "sequenceEqual" test', function (assert) {
    assert.ok(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]).sequenceEqual([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B')]), 'Test sequenceEqual in an array of objects overriding hash/equals methods');
    assert.ok(!mx([new mocks.Basic(1, 'A')]).sequenceEqual([new mocks.Basic(3, 'A')]), 'Test sequenceEqual in an array of objects overriding hash/equals methods');
});


qtest('collections "sequenceEqual" method tests', function (assert) {
    assert.ok(!mocks.enumerable.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in an enumerable');
    assert.ok(mocks.enumerable.sequenceEqual(mocks.enumerable), 'Test "sequenceEqual" in an enumerable');

    assert.ok(!mocks.collection.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Collection');
    assert.ok(mocks.collection.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a Collection');

    assert.ok(!mocks.list.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a List');
    assert.ok(mocks.list.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a List');

    assert.ok(!mocks.readOnlyCollection.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a ReadOnlyCollection');
    assert.ok(mocks.readOnlyCollection.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a ReadOnlyCollection');

    assert.ok(!mocks.linkedList.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a LinkedList');
    assert.ok(mocks.linkedList.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a LinkedList');

    assert.ok(!mocks.hashSet.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a HashSet');
    assert.ok(mocks.hashSet.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a HashSet');

    assert.ok(!mocks.stack.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Stack');
    assert.ok(mocks.stack.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a Stack');

    assert.ok(!mocks.queue.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Queue');
    assert.ok(mocks.queue.sequenceEqual(mocks.collection), 'Test "sequenceEqual" in a Queue');

    assert.ok(!mocks.set.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Set');
    assert.ok(mocks.set.sequenceEqual(mocks.set), 'Test "sequenceEqual" in a Set');

    assert.ok(!mocks.map.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Map');
    assert.ok(!mocks.map.sequenceEqual(mocks.map), 'Test "sequenceEqual" in a Map');

    assert.ok(!mocks.dictionary.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Dictionary');
    assert.ok(mocks.dictionary.sequenceEqual(mocks.dictionary), 'Test "sequenceEqual" in a Dictionary');

    assert.ok(!mocks.lookup.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a Lookup');
    assert.ok(mocks.lookup.sequenceEqual(mocks.lookup), 'Test "sequenceEqual" in a Lookup');

    assert.ok(!mocks.sortedList.sequenceEqual([]), 'Test "sequenceEqual" with an empty array in a SortedList');
    assert.ok(mocks.sortedList.sequenceEqual(mocks.sortedList), 'Test "sequenceEqual" in a SortedList');
});


qtest('sequenceEqual method validations', function (assert) {
    assert.throws(function () {
        mx([1]).sequenceEqual();
    }, 'null input');
});
