import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-first-or-default');

function simpleNumericPredicate(t) {
    return t > 100;
}


qtest('basic "firstOrDefault" test', function (assert) {
    assert.equal(mx([]).firstOrDefault(), null, 'firstOrDefault of an empty iterator');
    assert.equal(mx([]).firstOrDefault(simpleNumericPredicate, 0), 0, 'firstOrDefault of an empty iterator with default value');

    assert.equal(mx(mocks.array).firstOrDefault(), 1, 'firstOrDefault of an array of numbers');
    assert.equal(mx(mocks.array).firstOrDefault(simpleNumericPredicate), null, 'firstOrDefault of an array of numbers with predicate');
    assert.equal(mx(mocks.array).firstOrDefault(simpleNumericPredicate, 0), 0, 'firstOrDefault of an array of numbers with predicate and default value');
    assert.equal(mx('test').firstOrDefault(), 't', 'firstOrDefault of an string');
});


qtest('collections "firstOrDefault" method tests', function (assert) {
    assert.equal(mocks.enumerable.firstOrDefault(), 1, 'Test "firstOrDefault" in an enumerable');
    assert.equal(mocks.enumerable.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in an enumerable with predicate');
    assert.equal(mocks.enumerable.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in an enumerable with predicate and default value');

    assert.equal(mocks.collection.firstOrDefault(), 1, 'Test "firstOrDefault" in a Collection');
    assert.equal(mocks.collection.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Collection with predicate');
    assert.equal(mocks.collection.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Collection with predicate and default value');

    assert.equal(mocks.list.firstOrDefault(), 1, 'Test "firstOrDefault" in a List');
    assert.equal(mocks.list.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a List with predicate');
    assert.equal(mocks.list.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a List with predicate and default value');

    assert.equal(mocks.readOnlyCollection.firstOrDefault(), 1, 'Test "firstOrDefault" in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a ReadOnlyCollection with predicate');
    assert.equal(mocks.readOnlyCollection.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a ReadOnlyCollection with predicate and default value');

    assert.equal(mocks.linkedList.firstOrDefault(), 1, 'Test "firstOrDefault" in a LinkedList');
    assert.equal(mocks.linkedList.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a LinkedList with predicate');
    assert.equal(mocks.linkedList.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a LinkedList with predicate and default value');

    assert.equal(mocks.hashSet.firstOrDefault(), 1, 'Test "firstOrDefault" in a HashSet');
    assert.equal(mocks.hashSet.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a HashSet with predicate');
    assert.equal(mocks.hashSet.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a HashSet with predicate and default value');

    assert.equal(mocks.stack.firstOrDefault(), 1, 'Test "firstOrDefault" in a Stack');
    assert.equal(mocks.stack.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Stack with predicate');
    assert.equal(mocks.stack.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Stack with predicate and default value');

    assert.equal(mocks.queue.firstOrDefault(), 1, 'Test "firstOrDefault" in a Queue');
    assert.equal(mocks.queue.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Queue with predicate');
    assert.equal(mocks.queue.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Queue with predicate and default value');

    assert.equal(mocks.set.firstOrDefault(), 1, 'Test "firstOrDefault" in a Set');
    assert.equal(mocks.set.firstOrDefault(simpleNumericPredicate), null, 'Test "firstOrDefault" in a Set with predicate');
    assert.equal(mocks.set.firstOrDefault(simpleNumericPredicate, 0), 0, 'Test "firstOrDefault" in a Set with predicate and default value');

    assert.equal(mocks.map.firstOrDefault()[0], 1, 'Test "firstOrDefault" in a Map');
    assert.equal(mocks.map.firstOrDefault(function (t) {
        return t[0] > 100;
    }), null, 'Test "firstOrDefault" in a Map with predicate');
    assert.equal(mocks.map.firstOrDefault(function (t) {
        return t[0] > 100;
    }, 0), 0, 'Test "firstOrDefault" in a Map with predicate and default value');

    function keyvaluePredicate(t) {
        return t.key > 100;
    }

    assert.equal(mocks.dictionary.firstOrDefault().key, 1, 'Test "firstOrDefault" in a Dictionary');
    assert.equal(mocks.dictionary.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a Dictionary with predicate');
    assert.equal(mocks.dictionary.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a Dictionary with predicate and default value');

    assert.equal(mocks.lookup.firstOrDefault().key, 1, 'Test "firstOrDefault" in a Lookup');
    assert.equal(mocks.lookup.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a Lookup with predicate');
    assert.equal(mocks.lookup.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a Lookup with predicate and default value');

    assert.equal(mocks.sortedList.firstOrDefault().key, 1, 'Test "firstOrDefault" in a SortedList');
    assert.equal(mocks.sortedList.firstOrDefault(keyvaluePredicate), null, 'Test "firstOrDefault" in a SortedList with predicate');
    assert.equal(mocks.sortedList.firstOrDefault(keyvaluePredicate, 0), 0, 'Test "firstOrDefault" in a SortedList with predicate and default value');
});


qtest('firstOrDefault method validations', function (assert) {
    assert.throws(function () {
        mx([1]).firstOrDefault(1);
    }, 'non-function predicate');
});