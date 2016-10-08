import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-all');


function simpleNumericPredicate(t) {
    return t < 10;
}

qtest('basic all test', function (assert) {
    assert.ok(mx(mocks.array).all(simpleNumericPredicate), 'Test all numbers in an array are less than 10');

    assert.ok(!mx(mocks.array).all(function (t) {
        return t < 2;
    }), 'Test all numbers in an array are less than 2');

    assert.ok(mx([]).all(simpleNumericPredicate), 'Test all over an empty iterable results true');
});


qtest('collections all method tests', function (assert) {
    assert.ok(mx(mocks.collection).all(simpleNumericPredicate), 'Test all numbers in a Collection are less than 10');

    assert.ok(mx(mocks.list).all(simpleNumericPredicate), 'Test all numbers in a List are less than 10');

    assert.ok(mx(mocks.readOnlyCollection).all(simpleNumericPredicate), 'Test all numbers in a ReadOnlyCollection are less than 10');

    assert.ok(mx(mocks.linkedList).all(simpleNumericPredicate), 'Test all numbers in a LinkedList are less than 10');

    assert.ok(mx(mocks.hashSet).all(simpleNumericPredicate), 'Test all numbers in a HashSet are less than 10');

    assert.ok(mx(mocks.stack).all(simpleNumericPredicate), 'Test all numbers in a Stack are less than 10');

    assert.ok(mx(mocks.queue).all(simpleNumericPredicate), 'Test all numbers in a Queue are less than 10');

    assert.ok(mx(mocks.set).all(simpleNumericPredicate), 'Test all numbers in a Set are less than 10');

    assert.ok(mx(mocks.map).all(function (t) {
        return t[0] < 10;
    }), 'Test all numbers in a Map are less than 10');

    assert.ok(mx(mocks.dictionary).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a Dictionary are less than 10');

    assert.ok(mx(mocks.lookup).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a Lookup are less than 10');

    assert.ok(mx(mocks.sortedList).all(function (t) {
        return t.key < 10;
    }), 'Test all numbers in a SortedList are less than 10');
});


qtest('all method validations', function (assert) {
    assert.throws(function () {
        mx([1]).all();
    }, 'null input');

    assert.throws(function () {
        mx([1]).all([2], 1);
    }, 'non-function predicate');
});