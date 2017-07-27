import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-single');

function simpleNumericPredicate(t) {
    return t > 4;
}


qtest('basic "single" test', function (assert) {
    assert.equal(mx([1]).single(), 1, 'single of an array of numbers');
    assert.equal(mx(mocks.array).single(simpleNumericPredicate), 5, 'single of an array of numbers with predicate');
    assert.equal(mx('t').single(), 't', 'single of an string');
});


qtest('collections "single" method tests', function (assert) {
    assert.equal(mocks.enumerable.single(simpleNumericPredicate), 5, 'Test "single" in an enumerable with predicate');
    assert.equal(mocks.collection.single(simpleNumericPredicate), 5, 'Test "single" in an Collection with predicate');
    assert.equal(mocks.list.single(simpleNumericPredicate), 5, 'Test "single" in a List with predicate');
    assert.equal(mocks.readOnlyCollection.single(simpleNumericPredicate), 5, 'Test "single" in a ReadOnlyCollection with predicate');
    assert.equal(mocks.linkedList.single(simpleNumericPredicate), 5, 'Test "single" in a LinkedList with predicate');
    assert.equal(mocks.hashSet.single(simpleNumericPredicate), 5, 'Test "single" in a HashSet with predicate');
    assert.equal(mocks.stack.single(simpleNumericPredicate), 5, 'Test "single" in a Stack with predicate');
    assert.equal(mocks.queue.single(simpleNumericPredicate), 5, 'Test "single" in a Queue with predicate');
    assert.equal(mocks.set.single(simpleNumericPredicate), 5, 'Test "single" in a Set with predicate');
    assert.equal(mocks.map.single(function (t) {
        return t[0] > 4;
    })[0], 5, 'Test "single" in a Map with predicate');

    assert.equal(mocks.dictionary.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a Dictionary with predicate');

    assert.equal(mocks.lookup.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a Lookup with predicate');

    assert.equal(mocks.sortedList.single(function (t) {
        return t.key > 4;
    }).key, 5, 'Test "single" in a SortedList with predicate');
});


qtest('single method validations', function (assert) {
    assert.throws(function () {
        mx([]).single();
    }, 'no element');

    assert.throws(function () {
        mx([1]).single(simpleNumericPredicate);
    }, 'no match');

    assert.throws(function () {
        mx([1, 2]).single();
    }, 'more than one element');

    assert.throws(function () {
        mx([5, 6]).single(simpleNumericPredicate);
    }, 'more than one match');

    assert.throws(function () {
        mx([1]).single(1);
    }, 'non-function predicate');
});