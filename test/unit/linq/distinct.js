import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-distinct');


qtest('basic "distinct" test', function (assert) {
    assert.equal(mx(mocks.array).distinct().count(), 5, ' distinct count of an array of separate numbers');
    assert.equal(mx([1, 1, 1]).distinct().count(), 1, ' distinct count of an array of identical numbers');
    assert.equal(mx(['1', '1', '1']).distinct().count(), 1, ' distinct count of an array of identical strings');
    assert.equal(mx([true, true, true]).distinct().count(), 1, ' distinct count of an array of identical booleans');
    assert.equal(mx([null, null, null]).distinct().count(), 1, ' distinct count of an array of null values');
    assert.equal(mx([new Date(2017, 0, 1), new Date(2017, 0, 1), new Date(2017, 0, 1)]).distinct().count(), 1, ' distinct count of an array of identical dates');
    assert.equal(mx([{ val: 1 }, { val: 1 }, { val: 1 }]).distinct().count(), 1, ' distinct count of an array of identical object literals');
    assert.equal(mx([]).distinct().count(), 0, 'distinct count of an empty array');
});


qtest('"distinct" test using comparer', function (assert) {
    assert.equal(mx([{ val: 1, name: 'A' }, { val: 1, name: 'B' }, { val: 1, name: 'C' }]).distinct({
        hash: function (t) {
            return t.val;
        },
        equals: function (a, b) {
            return a.val === b.val && a.name === b.name;
        }
    }).count(), 3, 'distinct count of an array of distinct object literals using comparer');
});


qtest('collections "distinct" method tests', function (assert) {
    var numericComparer = {
        hash: function (t) {
            return t % 2;
        },
        equals: function (a, b) {
            return a === b;
        }
    };

    assert.equal(mocks.collection.distinct().count(), 5, 'Test "distinct" in a Collection');
    assert.equal(mocks.collection.distinct(numericComparer).count(), 5, 'Test "distinct" in a Collection with comparer');

    assert.equal(mocks.list.distinct().count(), 5, 'Test "distinct" in a List');
    assert.equal(mocks.list.distinct(numericComparer).count(), 5, 'Test "distinct" in a List with comparer');

    assert.equal(mocks.readOnlyCollection.distinct().count(), 5, 'Test "distinct" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.distinct(numericComparer).count(), 5, 'Test "distinct" in a ReadOnlyCollection with comparer');

    assert.equal(mocks.linkedList.distinct().count(), 5, 'Test "distinct" in a LinkedList');
    assert.equal(mocks.linkedList.distinct(numericComparer).count(), 5, 'Test "distinct" in a LinkedList with comparer');

    assert.equal(mocks.hashSet.distinct().count(), 5, 'Test "distinct" in a HashSet');
    assert.equal(mocks.hashSet.distinct(numericComparer).count(), 5, 'Test "distinct" in a HashSet with comparer');

    assert.equal(mocks.stack.distinct().count(), 5, 'Test "distinct" in a Stack');
    assert.equal(mocks.stack.distinct(numericComparer).count(), 5, 'Test "distinct" in a Stack with comparer');

    assert.equal(mocks.queue.distinct().count(), 5, 'Test "distinct" in a Queue');
    assert.equal(mocks.queue.distinct(numericComparer).count(), 5, 'Test "distinct" in a Queue with comparer');

    assert.equal(mocks.set.distinct().count(), 5, 'Test "distinct" in a Set');
    assert.equal(mocks.set.distinct(numericComparer).count(), 5, 'Test "distinct" in a Set with comparer');

    var mapComparer = {
        hash: function (t) {
            return t[0] % 2;
        },
        equals: function (a, b) {
            return a[0] === b[0];
        }
    };

    assert.equal(mocks.map.distinct().count(), 5, 'Test "distinct" in a Map');
    assert.equal(mocks.map.distinct(mapComparer).count(), 5, 'Test "distinct" in a Map with comparer');

    var keyValuePairComparer = {
        hash: function (t) {
            return t.key % 2;
        },
        equals: function (a, b) {
            return a.key === b.key;
        }
    };

    assert.equal(mocks.dictionary.distinct().count(), 5, 'Test "distinct" in a Dictionary');
    assert.equal(mocks.dictionary.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Dictionary with comparer');

    assert.equal(mocks.lookup.distinct().count(), 5, 'Test "distinct" in a Lookup');
    assert.equal(mocks.lookup.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a Lookup with comparer');

    assert.equal(mocks.sortedList.distinct().count(), 5, 'Test "distinct" in a SortedList');
    assert.equal(mocks.sortedList.distinct(keyValuePairComparer).count(), 5, 'Test "distinct" in a SortedList with comparer');
});