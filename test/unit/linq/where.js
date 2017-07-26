import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-where');


function simpleNumericPredicate(t) {
    return t < 10;
}

qtest('basic where test', function (assert) {
    assert.equal(mx(mocks.array).where(simpleNumericPredicate).count(), mocks.array.length, 'Test where numbers in an array are less than 10');

    assert.equal(mx(mocks.array).where(function (t) {
        return t > 10;
    }).count(), 0, 'Test where numbers in an array are greater than 10');

    assert.equal(mx([]).where(simpleNumericPredicate).count(), 0, 'Test where over an empty iterable results false');
});


qtest('collections where method tests', function (assert) {
    var len = mocks.array.length;
    assert.equal(mocks.collection.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Collection are less than 10');
    assert.equal(mocks.list.where(simpleNumericPredicate).count(), len, 'Test where numbers in a List are less than 10');
    assert.equal(mocks.readOnlyCollection.where(simpleNumericPredicate).count(), len, 'Test where numbers in a ReadOnlyCollection are less than 10');
    assert.equal(mocks.linkedList.where(simpleNumericPredicate).count(), len, 'Test where numbers in a LinkedList are less than 10');
    assert.equal(mocks.hashSet.where(simpleNumericPredicate).count(), len, 'Test where numbers in a HashSet are less than 10');
    assert.equal(mocks.stack.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Stack are less than 10');
    assert.equal(mocks.queue.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Queue are less than 10');
    assert.equal(mocks.set.where(simpleNumericPredicate).count(), len, 'Test where numbers in a Set are less than 10');

    assert.equal(mocks.map.where(function (t) {
        return t[0] < 10;
    }).count(), len, 'Test where numbers in a Map are less than 10');

    assert.equal(mocks.dictionary.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a Dictionary are less than 10');

    assert.equal(mocks.lookup.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a Lookup are less than 10');

    assert.equal(mocks.sortedList.where(function (t) {
        return t.key < 10;
    }).count(), len, 'Test where numbers in a SortedList are less than 10');
});


qtest('where method validations', function (assert) {
    assert.throws(function () {
        mx([1]).where();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).where(1);
    }, 'non-function predicate');
});