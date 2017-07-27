import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-first');

function simpleNumericPredicate(t) {
    return t > 3;
}


qtest('basic "first" test', function (assert) {
    assert.equal(mx(mocks.array).first(), 1, 'first of an array of numbers');
    assert.equal(mx(mocks.array).first(simpleNumericPredicate), 4, 'first of an array of numbers with predicate');
    assert.equal(mx('test').first(), 't', 'first of an string');
});


qtest('collections "first" method tests', function (assert) {
    assert.equal(mocks.collection.first(), 1, 'Test "first" in a Collection');
    assert.equal(mocks.collection.first(simpleNumericPredicate), 4, 'Test "first" in a Collection with predicate');

    assert.equal(mocks.list.first(), 1, 'Test "first" in a List');
    assert.equal(mocks.list.first(simpleNumericPredicate), 4, 'Test "first" in a List with predicate');

    assert.equal(mocks.readOnlyCollection.first(), 1, 'Test "first" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.first(simpleNumericPredicate), 4, 'Test "first" in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.first(), 1, 'Test "first" in a LinkedList');
    assert.equal(mocks.linkedList.first(simpleNumericPredicate), 4, 'Test "first" in a LinkedList with predicate');

    assert.equal(mocks.hashSet.first(), 1, 'Test "first" in a HashSet');
    assert.equal(mocks.hashSet.first(simpleNumericPredicate), 4, 'Test "first" in a HashSet with predicate');

    assert.equal(mocks.stack.first(), 1, 'Test "first" in a Stack');
    assert.equal(mocks.stack.first(simpleNumericPredicate), 4, 'Test "first" in a Stack with predicate');

    assert.equal(mocks.queue.first(), 1, 'Test "first" in a Queue');
    assert.equal(mocks.queue.first(simpleNumericPredicate), 4, 'Test "first" in a Queue with predicate');

    assert.equal(mocks.set.first(), 1, 'Test "first" in a Set');
    assert.equal(mocks.set.first(simpleNumericPredicate), 4, 'Test "first" in a Set with predicate');

    assert.equal(mocks.map.first()[0], 1, 'Test "first" in a Map');
    assert.equal(mocks.map.first(function (t) {
        return t[0] > 3;
    })[0], 4, 'Test "first" in a Map with predicate');

    assert.equal(mocks.dictionary.first().key, 1, 'Test "first" in a Dictionary');
    assert.equal(mocks.dictionary.first(function (t) {
        return t.key > 3;
    }).key, 4, 'Test "first" in a Dictionary with predicate');

    assert.equal(mocks.lookup.first().key, 1, 'Test "first" in a Lookup');
    assert.equal(mocks.lookup.first(function (t) {
        return t.key > 3;
    }).key, 4, 'Test "first" in a Lookup with predicate');

    assert.equal(mocks.sortedList.first().key, 1, 'Test "first" in a SortedList');
    assert.equal(mocks.sortedList.first(function (t) {
        return t.key > 3;
    }).key, 4, 'Test "first" in a SortedList with predicate');
});


qtest('first method validations', function (assert) {
    assert.throws(function () {
        mx([]).first();
    }, 'empty collection');

    assert.throws(function () {
        mx([1]).first(1);
    }, 'non-function predicate');

    assert.throws(function () {
        mx([1]).first(simpleNumericPredicate);
    }, 'no match');
});