import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-single-or-default');

function simpleNumericPredicate(t) {
    return t > 5;
}


qtest('basic "singleOrDefault" test', function (assert) {
    assert.equal(mx([1]).singleOrDefault(), 1, 'singleOrDefault of an array of numbers');
    assert.equal(mx([]).singleOrDefault(), null, 'singleOrDefault of an array of numbers with default value');

    assert.equal(mx(mocks.array).singleOrDefault(simpleNumericPredicate), null, 'singleOrDefault of an array of numbers with predicate');
    assert.equal(mx(mocks.array).singleOrDefault(simpleNumericPredicate, 0), 0, 'singleOrDefault of an array of numbers with predicate and default value');

    assert.equal(mx('t').singleOrDefault(), 't', 'singleOrDefault of an string');
});


qtest('collections "singleOrDefault" method tests', function (assert) {
    assert.equal(mocks.enumerable.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in an enumerable with predicate');
    assert.equal(mocks.enumerable.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in an enumerable with predicate and default value');

    assert.equal(mocks.collection.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Collection with predicate');
    assert.equal(mocks.collection.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Collection with predicate and default value');

    assert.equal(mocks.list.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a List with predicate');
    assert.equal(mocks.list.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a List with predicate and default value');

    assert.equal(mocks.readOnlyCollection.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a ReadOnlyCollection with predicate');
    assert.equal(mocks.readOnlyCollection.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a ReadOnlyCollection with predicate and default value');

    assert.equal(mocks.linkedList.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a LinkedList with predicate');
    assert.equal(mocks.linkedList.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a LinkedList with predicate and default value');

    assert.equal(mocks.hashSet.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a HashSet with predicate');
    assert.equal(mocks.hashSet.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a HashSet with predicate and default value');

    assert.equal(mocks.stack.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Stack with predicate');
    assert.equal(mocks.stack.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Stack with predicate and default value');

    assert.equal(mocks.queue.singleOrDefault(simpleNumericPredicate), null, 'Test "singleOrDefault" in a Queue with predicate');
    assert.equal(mocks.set.singleOrDefault(simpleNumericPredicate, 0), 0, 'Test "singleOrDefault" in a Set with predicate and default value');

    assert.equal(mocks.map.singleOrDefault(function (t) {
        return t[0] > 5;
    }), null, 'Test "singleOrDefault" in a Map with predicate');

    assert.equal(mocks.map.singleOrDefault(function (t) {
        return t[0] > 5;
    }, 0), 0, 'Test "singleOrDefault" in a Map with predicate');

    function keyvaluepredicate(t) {
        return t.key > 5;
    }

    assert.equal(mocks.dictionary.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a Dictionary with predicate');
    assert.equal(mocks.dictionary.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a Dictionary with predicate and default value');

    assert.equal(mocks.lookup.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a Lookup with predicate');
    assert.equal(mocks.lookup.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a Lookup with predicate and default value');

    assert.equal(mocks.sortedList.singleOrDefault(keyvaluepredicate), null, 'Test "singleOrDefault" in a SortedList with predicate');
    assert.equal(mocks.sortedList.singleOrDefault(keyvaluepredicate, 0), 0, 'Test "singleOrDefault" in a SortedList with predicate and default value');
});


qtest('single method validations', function (assert) {
    assert.throws(function () {
        mx([1, 2]).singleOrDefault();
    }, 'more than one element');

    assert.throws(function () {
        mx([6, 7]).singleOrDefault(simpleNumericPredicate);
    }, 'more than one match');

    assert.throws(function () {
        mx([1]).singleOrDefault(1);
    }, 'non-function predicate');
});