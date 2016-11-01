import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-count');

function simpleNumericPredicate(t) {
    return t < 3;
}


qtest('basic "count" test', function (assert) {
    assert.equal(mx(mocks.array).count(), 5, 'count of an array');
    assert.equal(mx([]).count(), 0, 'count of an empty array');
});


qtest('collections "count" method tests', function (assert) {
    assert.equal(mocks.collection.count(), 5, 'Test "count" in a Collection');
    assert.equal(mocks.collection.count(simpleNumericPredicate), 2, 'Test "count" in a Collection with predicate');

    assert.equal(mocks.list.count(), 5, 'Test "count" in a List');
    assert.equal(mocks.list.count(simpleNumericPredicate), 2, 'Test "count" in a List with predicate');

    assert.equal(mocks.readOnlyCollection.count(), 5, 'Test "count" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.count(simpleNumericPredicate), 2, 'Test "count" in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.count(), 5, 'Test "count" in a LinkedList');
    assert.equal(mocks.linkedList.count(simpleNumericPredicate), 2, 'Test "count" in a LinkedList with predicate');

    assert.equal(mocks.hashSet.count(), 5, 'Test "count" in a HashSet');
    assert.equal(mocks.hashSet.count(simpleNumericPredicate), 2, 'Test "count" in a HashSet with predicate');

    assert.equal(mocks.stack.count(), 5, 'Test "count" in a Stack');
    assert.equal(mocks.stack.count(simpleNumericPredicate), 2, 'Test "count" in a Stack with predicate');

    assert.equal(mocks.queue.count(), 5, 'Test "count" in a Queue');
    assert.equal(mocks.queue.count(simpleNumericPredicate), 2, 'Test "count" in a Queue with predicate');

    assert.equal(mocks.set.count(), 5, 'Test "count" in a Set');
    assert.equal(mocks.set.count(simpleNumericPredicate), 2, 'Test "count" in a Set with predicate');

    assert.equal(mocks.map.count(), 5, 'Test "count" in a Map');
    assert.equal(mocks.map.count(function (t) {
        return t[0] < 3;
    }), 2, 'Test "count" in a Map with predicate');

    assert.equal(mocks.dictionary.count(), 5, 'Test "count" in a Dictionary');
    assert.equal(mocks.dictionary.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a Dictionary with predicate');

    assert.equal(mocks.lookup.count(), 5, 'Test "count" in a Lookup');
    assert.equal(mocks.lookup.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a Lookup with predicate');

    assert.equal(mocks.sortedList.count(), 5, 'Test "count" in a SortedList');
    assert.equal(mocks.sortedList.count(function (t) {
        return t.key < 3;
    }), 2, 'Test "count" in a SortedList with predicate');
});


qtest('count method validations', function (assert) {
    assert.throws(function () {
        mx([1]).count(1);
    }, 'non-function predicate');
});