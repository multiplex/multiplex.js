import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-sum');

function double(t) {
    return t * 2;
}

function calcsum(items, selector) {
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        sum += (selector ? selector(items[i]) : items[i]);
    }

    return sum;
}

qtest('basic "sum" test', function (assert) {
    assert.equal(mx(mocks.array).sum(), calcsum(mocks.array), 'sum element of an array of numbers');
    assert.equal(mx(mocks.array).sum(double), calcsum(mocks.array, double), 'sum element of an array of numbers with selector');
    assert.equal(mx([]).sum(), 0, 'sum of empty array');
    assert.equal(mx([]).sum(double), 0, 'sum of empty array with selector');
});



qtest('collections "sum" method tests', function (assert) {
    var s1 = calcsum(mocks.array);
    var s2 = calcsum(mocks.array, double);

    assert.equal(mocks.enumerable.sum(), s1, 'sum element in an enumerable');
    assert.equal(mocks.enumerable.sum(double), s2, 'sum element in an enumerable with predicate');

    assert.equal(mocks.collection.sum(), s1, 'sum element in a Collection');
    assert.equal(mocks.collection.sum(double), s2, 'sum element in a Collection with predicate');

    assert.equal(mocks.list.sum(), s1, 'sum element in a List');
    assert.equal(mocks.list.sum(double), s2, 'sum element in a List with predicate');

    assert.equal(mocks.readOnlyCollection.sum(), s1, 'sum element in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.sum(double), s2, 'sum element in a ReadOnlyCollection with predicate');

    assert.equal(mocks.linkedList.sum(), s1, 'sum element in a LinkedList');
    assert.equal(mocks.linkedList.sum(double), s2, 'sum element in a LinkedList with predicate');

    assert.equal(mocks.hashSet.sum(), s1, 'sum element in a HashSet');
    assert.equal(mocks.hashSet.sum(double), s2, 'sum element in a HashSet with predicate');

    assert.equal(mocks.stack.sum(), s1, 'sum element in a Stack');
    assert.equal(mocks.stack.sum(double), s2, 'sum element in a Stack with predicate');

    assert.equal(mocks.queue.sum(), s1, 'sum element in a Queue');
    assert.equal(mocks.queue.sum(double), s2, 'sum element in a Queue with predicate');

    assert.equal(mocks.set.sum(), s1, 'sum element in a Set');
    assert.equal(mocks.set.sum(double), s2, 'sum element in a Set with predicate');

    assert.equal(mocks.map.sum(function (t) {
        return t[0];
    }), s1, 'sum element in a Map');

    assert.equal(mocks.dictionary.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a Dictionary');

    assert.equal(mocks.lookup.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a Lookup');

    assert.equal(mocks.sortedList.sum(function (t) {
        return t.key;
    }), s1, 'sum element in a SortedList');
});



qtest('"sum" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).sum(1);
    }, 'non function selector');

    assert.throws(function () {
        mx(['a']).sum();
    }, 'non numeric iterator');
});