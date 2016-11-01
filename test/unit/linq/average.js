import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-average');


function simpleNumericSelector(t) {
    return t * 2;
}

qtest('basic "average" test', function (assert) {
    assert.equal(mx(mocks.array).average(), 3, 'Test average of first 5 numbers');
    assert.equal(mx(mocks.array).average(simpleNumericSelector), 6, 'Test average of first 5 numbers using a selector');
});


qtest('collections "average" method tests', function (assert) {
    assert.equal(mocks.collection.average(), 3, 'Test average of numbers in a Collection');
    assert.equal(mocks.collection.average(simpleNumericSelector), 6, 'Test average of numbers in a Collection with a selector');

    assert.equal(mocks.list.average(), 3, 'Test average of numbers in a List');
    assert.equal(mocks.list.average(simpleNumericSelector), 6, 'Test average of numbers in a List with a selector');

    assert.equal(mocks.readOnlyCollection.average(), 3, 'Test average of numbers in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.average(simpleNumericSelector), 6, 'Test average of numbers in a ReadOnlyCollection with a selector');

    assert.equal(mocks.linkedList.average(), 3, 'Test average of numbers in a LinkedList');
    assert.equal(mocks.linkedList.average(simpleNumericSelector), 6, 'Test average of numbers in a LinkedList with a selector');

    assert.equal(mocks.hashSet.average(), 3, 'Test average of numbers in a HashSet');
    assert.equal(mocks.hashSet.average(simpleNumericSelector), 6, 'Test average of numbers in a HashSet with a selector');

    assert.equal(mocks.stack.average(), 3, 'Test average of numbers in a Stack');
    assert.equal(mocks.stack.average(simpleNumericSelector), 6, 'Test average of numbers in a Stack with a selector');

    assert.equal(mocks.queue.average(), 3, 'Test average of numbers in a Queue');
    assert.equal(mocks.queue.average(simpleNumericSelector), 6, 'Test average of numbers in a Queue with a selector');

    assert.equal(mocks.set.average(), 3, 'Test average of numbers in a Set');
    assert.equal(mocks.set.average(simpleNumericSelector), 6, 'Test average of numbers in a Set with a selector');

    assert.equal(mocks.map.average(function (t) {
        return t[0];
    }), 3, 'Test average of numbers in a Map with a selector');

    assert.equal(mocks.dictionary.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a Dictionary with a selector');

    assert.equal(mocks.lookup.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a Lookup with a selector');

    assert.equal(mocks.sortedList.average(function (t) {
        return t.key;
    }), 3, 'Test average of numbers in a SortedList with a selector');
});


qtest('"average" method validations', function (assert) {
    assert.throws(function () {
        mx([]).average();
    }, 'no elements error');

    assert.throws(function () {
        mx([]).average();
    }, 'non numeric average error');

    assert.throws(function () {
        mx(['a']).average(function (t) {
            return t;
        });
    }, 'non numeric average with selector error');

    assert.throws(function () {
        mx([1]).average(1);
    }, 'non-function predicate');
});