import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-any');


function simpleNumericPredicate(t) {
    return t < 10;
}

qtest('basic any test', function (assert) {
    assert.ok(mx(mocks.array).any(simpleNumericPredicate), 'Test any numbers in an array are less than 10');

    assert.ok(!mx(mocks.array).any(function (t) {
        return t > 10;
    }), 'Test any numbers in an array are greater than 10');

    assert.ok(mx([1]).any(), 'Test any without predicate over non empty iterable results true');
    assert.ok(!mx([]).any(simpleNumericPredicate), 'Test any over an empty iterable results false');
});


qtest('collections any method tests', function (assert) {
    assert.ok(mocks.collection.any(), 'Test any item in a Collection');
    assert.ok(mocks.collection.any(simpleNumericPredicate), 'Test any numbers in a Collection are less than 10');

    assert.ok(mocks.list.any(), 'Test any item in a List');
    assert.ok(mocks.list.any(simpleNumericPredicate), 'Test any numbers in a List are less than 10');

    assert.ok(mocks.readOnlyCollection.any(), 'Test any item in a ReadOnlyCollection');
    assert.ok(mocks.readOnlyCollection.any(simpleNumericPredicate), 'Test any numbers in a ReadOnlyCollection are less than 10');

    assert.ok(mocks.linkedList.any(), 'Test any item in a LinkedList');
    assert.ok(mocks.linkedList.any(simpleNumericPredicate), 'Test any numbers in a LinkedList are less than 10');

    assert.ok(mocks.hashSet.any(), 'Test any item in a HashSet');
    assert.ok(mocks.hashSet.any(simpleNumericPredicate), 'Test any numbers in a HashSet are less than 10');

    assert.ok(mocks.stack.any(), 'Test any item in a Stack');
    assert.ok(mocks.stack.any(simpleNumericPredicate), 'Test any numbers in a Stack are less than 10');

    assert.ok(mocks.queue.any(), 'Test any item in a Queue');
    assert.ok(mocks.queue.any(simpleNumericPredicate), 'Test any numbers in a Queue are less than 10');

    assert.ok(mocks.set.any(), 'Test any item in a Set');
    assert.ok(mocks.set.any(simpleNumericPredicate), 'Test any numbers in a Set are less than 10');

    assert.ok(mocks.map.any(), 'Test any item in a Map');
    assert.ok(mocks.map.any(function (t) {
        return t[0] < 10;
    }), 'Test any numbers in a Map are less than 10');

    assert.ok(mocks.dictionary.any(), 'Test any item in a Dictionary');
    assert.ok(mocks.dictionary.any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a Dictionary are less than 10');

    assert.ok(mocks.lookup.any(), 'Test any item in a Lookup');
    assert.ok(mocks.lookup.any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a Lookup are less than 10');

    assert.ok(mocks.sortedList.any(), 'Test any item in a SortedList');
    assert.ok(mocks.sortedList.any(function (t) {
        return t.key < 10;
    }), 'Test any numbers in a SortedList are less than 10');
});


qtest('any method validations', function (assert) {
    assert.throws(function () {
        mx([1]).all([2], 1);
    }, 'non-function predicate');
});