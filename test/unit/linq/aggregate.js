import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-aggregate');


function sumAggregateFunc(a, b) {
    return a + b;
}

function simpleAggregateResult(t) {
    return t * 2;
}


qtest('basic aggregate over numbers', function (assert) {
    assert.equal(mx(mocks.array).aggregate(10, sumAggregateFunc), 25, 'Aggregate 5 numbers with seed!');

    assert.equal(mx(mocks.array).aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate 5 numbers with seed and result selector!');
});


qtest('collections aggregate', function (assert) {
    assert.equal(mocks.collection.aggregate(10, sumAggregateFunc), 25, 'Aggregate collection of numbers with seed!');
    assert.equal(mocks.collection.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate collection of numbers with seed and result selector!');


    assert.equal(mocks.list.aggregate(10, sumAggregateFunc), 25, 'Aggregate list of numbers with seed!');
    assert.equal(mocks.list.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate list of numbers with seed and result selector!');


    assert.equal(mocks.readOnlyCollection.aggregate(10, sumAggregateFunc), 25, 'Aggregate readOnlyCollection of numbers with seed!');
    assert.equal(mocks.readOnlyCollection.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate readOnlyCollection of numbers with seed and result selector!');


    assert.equal(mocks.linkedList.aggregate(10, sumAggregateFunc), 25, 'Aggregate linkedList of numbers with seed!');
    assert.equal(mocks.linkedList.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate linkedList of numbers with seed and result selector!');


    assert.equal(mocks.hashSet.aggregate(10, sumAggregateFunc), 25, 'Aggregate hashSet of numbers with seed!');
    assert.equal(mocks.hashSet.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate hashSet of numbers with seed and result selector!');


    assert.equal(mocks.stack.aggregate(10, sumAggregateFunc), 25, 'Aggregate stack of numbers with seed!');
    assert.equal(mocks.stack.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate stack of numbers with seed and result selector!');


    assert.equal(mocks.queue.aggregate(10, sumAggregateFunc), 25, 'Aggregate queue of numbers with seed!');
    assert.equal(mocks.queue.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate queue of numbers with seed and result selector!');


    assert.equal(mocks.set.aggregate(10, sumAggregateFunc), 25, 'Aggregate set of numbers with seed!');
    assert.equal(mocks.set.aggregate(10, sumAggregateFunc, simpleAggregateResult), 50, 'Aggregate set of numbers with seed and result selector!');

    assert.equal(mocks.map.aggregate(10, function (a, b) {
        return a + b[0];
    }), 25, 'Aggregate map of numbers with seed!');

    assert.equal(mocks.map.aggregate(10, function (a, b) {
        return a + b[0];
    }, simpleAggregateResult), 50, 'Aggregate map of numbers with seed and result selector!');


    assert.equal(mocks.dictionary.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate dictionary of numbers with seed!');

    assert.equal(mocks.dictionary.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate dictionary of numbers with seed and result selector!');


    assert.equal(mocks.sortedList.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate sortedList of numbers with seed!');

    assert.equal(mocks.sortedList.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate sortedList of numbers with seed and result selector!');


    assert.equal(mocks.lookup.aggregate(10, function (a, b) {
        return a + b.key;
    }), 25, 'Aggregate lookup of numbers with seed!');

    assert.equal(mocks.lookup.aggregate(10, function (a, b) {
        return a + b.key;
    }, simpleAggregateResult), 50, 'Aggregate lookup of numbers with seed and result selector!');
});



qtest('aggregate method validations', function (assert) {
    assert.throws(function () {
        mx([1]).aggregate();
    }, 'null input');

    assert.throws(function () {
        mx([1]).aggregate(0, 0);
    }, 'non-function aggregate function');

    assert.throws(function () {
        mx([1]).aggregate(0, sumAggregateFunc, 1);
    }, 'non-function resultSelector');
});