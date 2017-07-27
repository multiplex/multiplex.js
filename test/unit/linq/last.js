import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-last');

function simpleNumericPredicate(t) {
    return t <= 4;
}


qtest('basic "last" test', function (assert) {
    assert.equal(mx(mocks.array).last(), 5, 'last of an array of numbers');
    assert.equal(mx(mocks.array).last(simpleNumericPredicate), 4, 'last of an array of numbers with predicate');
    assert.equal(mx('string').last(), 'g', 'last of an string');
});


qtest('collections "last" method tests', function (assert) {
    assert.equal(mocks.collection.last(), 5, 'Test "last" in a Collection');
    assert.equal(mocks.collection.last(simpleNumericPredicate), 4, 'Test "last" in a Collection with predicate');

    assert.equal(mocks.list.last(), 5, 'Test "last" in a List');
    assert.equal(mocks.list.last(simpleNumericPredicate), 4, 'Test "last" in a List with predicate');

    assert.equal(mocks.readOnlyCollection.last(), 5, 'Test "last" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.last(simpleNumericPredicate), 4, 'Test "last" in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.last(), 5, 'Test "last" in a LinkedList');
    assert.equal(mocks.linkedList.last(simpleNumericPredicate), 4, 'Test "last" in a LinkedList with predicate');

    assert.equal(mocks.hashSet.last(), 5, 'Test "last" in a HashSet');
    assert.equal(mocks.hashSet.last(simpleNumericPredicate), 4, 'Test "last" in a HashSet with predicate');

    assert.equal(mocks.stack.last(), 5, 'Test "last" in a Stack');
    assert.equal(mocks.stack.last(simpleNumericPredicate), 4, 'Test "last" in a Stack with predicate');

    assert.equal(mocks.queue.last(), 5, 'Test "last" in a Queue');
    assert.equal(mocks.queue.last(simpleNumericPredicate), 4, 'Test "last" in a Queue with predicate');

    assert.equal(mocks.set.last(), 5, 'Test "last" in a Set');
    assert.equal(mocks.set.last(simpleNumericPredicate), 4, 'Test "last" in a Set with predicate');

    assert.equal(mocks.map.last()[0], 5, 'Test "last" in a Map');
    assert.equal(mocks.map.last(function (t) {
        return t[0] <= 4;
    })[0], 4, 'Test "last" in a Map with predicate');

    assert.equal(mocks.dictionary.last().key, 5, 'Test "last" in a Dictionary');
    assert.equal(mocks.dictionary.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a Dictionary with predicate');

    assert.equal(mocks.lookup.last().key, 5, 'Test "last" in a Lookup');
    assert.equal(mocks.lookup.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a Lookup with predicate');

    assert.equal(mocks.sortedList.last().key, 5, 'Test "last" in a SortedList');
    assert.equal(mocks.sortedList.last(function (t) {
        return t.key <= 4;
    }).key, 4, 'Test "last" in a SortedList with predicate');
});


qtest('last method validations', function (assert) {
    assert.throws(function () {
        mx([]).last();
    }, 'empty collection');

    assert.throws(function () {
        mx([5]).last(5);
    }, 'non-function predicate');

    assert.throws(function () {
        mx([5]).last(simpleNumericPredicate);
    }, 'no match');
});