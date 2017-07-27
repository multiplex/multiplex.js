import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-last-or-default');

function simpleNumericPredicate(t) {
    return t > 100;
}


qtest('basic "lastOrDefault" test', function (assert) {
    assert.equal(mx([]).lastOrDefault(), null, 'lastOrDefault of an empty iterator');
    assert.equal(mx([]).lastOrDefault(simpleNumericPredicate, 0), 0, 'lastOrDefault of an empty iterator with default value');

    assert.equal(mx(mocks.array).lastOrDefault(), 5, 'lastOrDefault of an array of numbers');
    assert.equal(mx(mocks.array).lastOrDefault(simpleNumericPredicate), null, 'lastOrDefault of an array of numbers with predicate');
    assert.equal(mx(mocks.array).lastOrDefault(simpleNumericPredicate, 0), 0, 'lastOrDefault of an array of numbers with predicate and default value');
    assert.equal(mx('string').lastOrDefault(), 'g', 'lastOrDefault of an string');
});


qtest('collections "lastOrDefault" method tests', function (assert) {
    assert.equal(mocks.collection.lastOrDefault(), 5, 'Test "lastOrDefault" in a Collection');
    assert.equal(mocks.collection.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a Collection with predicate');
    assert.equal(mocks.collection.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a Collection with predicate and default value');

    assert.equal(mocks.list.lastOrDefault(), 5, 'Test "lastOrDefault" in a List');
    assert.equal(mocks.list.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a List with predicate');
    assert.equal(mocks.list.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a List with predicate and default value');

    assert.equal(mocks.readOnlyCollection.lastOrDefault(), 5, 'Test "lastOrDefault" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a ReadOnlyCollection with predicate');
    assert.equal(mocks.readOnlyCollection.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a ReadOnlyCollection with predicate and default value');

    assert.equal(mocks.linkedList.lastOrDefault(), 5, 'Test "lastOrDefault" in a LinkedList');
    assert.equal(mocks.linkedList.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a LinkedList with predicate');
    assert.equal(mocks.linkedList.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a LinkedList with predicate and default value');

    assert.equal(mocks.hashSet.lastOrDefault(), 5, 'Test "lastOrDefault" in a HashSet');
    assert.equal(mocks.hashSet.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a HashSet with predicate');
    assert.equal(mocks.hashSet.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a HashSet with predicate and default value');

    assert.equal(mocks.stack.lastOrDefault(), 5, 'Test "lastOrDefault" in a Stack');
    assert.equal(mocks.stack.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a Stack with predicate');
    assert.equal(mocks.stack.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a Stack with predicate and default value');

    assert.equal(mocks.queue.lastOrDefault(), 5, 'Test "lastOrDefault" in a Queue');
    assert.equal(mocks.queue.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a Queue with predicate');
    assert.equal(mocks.queue.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a Queue with predicate and default value');

    assert.equal(mocks.set.lastOrDefault(), 5, 'Test "lastOrDefault" in a Set');
    assert.equal(mocks.set.lastOrDefault(simpleNumericPredicate), null, 'Test "lastOrDefault" in a Set with predicate');
    assert.equal(mocks.set.lastOrDefault(simpleNumericPredicate, 0), 0, 'Test "lastOrDefault" in a Set with predicate and default value');

    assert.equal(mocks.map.lastOrDefault()[0], 5, 'Test "lastOrDefault" in a Map');
    assert.equal(mocks.map.lastOrDefault(function (t) {
        return t[0] > 100;
    }), null, 'Test "lastOrDefault" in a Map with predicate');
    assert.equal(mocks.map.lastOrDefault(function (t) {
        return t[0] > 100;
    }, 0), 0, 'Test "lastOrDefault" in a Map with predicate and default value');

    function keyvaluePredicate(t) {
        return t.key > 100;
    }

    assert.equal(mocks.dictionary.lastOrDefault().key, 5, 'Test "lastOrDefault" in a Dictionary');
    assert.equal(mocks.dictionary.lastOrDefault(keyvaluePredicate), null, 'Test "lastOrDefault" in a Dictionary with predicate');
    assert.equal(mocks.dictionary.lastOrDefault(keyvaluePredicate, 0), 0, 'Test "lastOrDefault" in a Dictionary with predicate and default value');

    assert.equal(mocks.lookup.lastOrDefault().key, 5, 'Test "lastOrDefault" in a Lookup');
    assert.equal(mocks.lookup.lastOrDefault(keyvaluePredicate), null, 'Test "lastOrDefault" in a Lookup with predicate');
    assert.equal(mocks.lookup.lastOrDefault(keyvaluePredicate, 0), 0, 'Test "lastOrDefault" in a Lookup with predicate and default value');

    assert.equal(mocks.sortedList.lastOrDefault().key, 5, 'Test "lastOrDefault" in a SortedList');
    assert.equal(mocks.sortedList.lastOrDefault(keyvaluePredicate), null, 'Test "lastOrDefault" in a SortedList with predicate');
    assert.equal(mocks.sortedList.lastOrDefault(keyvaluePredicate, 0), 0, 'Test "lastOrDefault" in a SortedList with predicate and default value');
});


qtest('lastOrDefault method validations', function (assert) {
    assert.throws(function () {
        mx([1]).lastOrDefault(1);
    }, 'non-function predicate');
});