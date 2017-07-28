import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-skip-while');

var limit = 3;
var count = mocks.array.length - limit;
function simpleNumericPredicate(t) {
    return t <= limit;
}

qtest('basic "skip-while" test', function (assert) {
    assert.equal(mx(mocks.array).skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in an array are less than 10');
    assert.equal(mx(mocks.enumerable).skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in an enumerable are less than 10');

    assert.equal(mx(mocks.array).skipWhile(function (t) {
        return t < 10;
    }).count(), 0, 'Test skipWhile numbers in an array are less than 10');

    assert.equal(mx(mocks.array).skipWhile(function (t) {
        return t > 10;
    }).count(), mocks.array.length, 'Test skipWhile numbers in an array are greater than 10');

    assert.equal(mx([]).skipWhile(simpleNumericPredicate).count(), 0, 'Test skipWhile over an empty iterable results false');
});


qtest('collections "skip-while" method tests', function (assert) {
    assert.equal(mocks.collection.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Collection are less than 10');
    assert.equal(mocks.list.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a List are less than 10');
    assert.equal(mocks.readOnlyCollection.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a ReadOnlyCollection are less than 10');
    assert.equal(mocks.linkedList.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a LinkedList are less than 10');
    assert.equal(mocks.hashSet.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a HashSet are less than 10');
    assert.equal(mocks.stack.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Stack are less than 10');
    assert.equal(mocks.queue.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Queue are less than 10');
    assert.equal(mocks.set.skipWhile(simpleNumericPredicate).count(), count, 'Test skipWhile numbers in a Set are less than 10');

    assert.equal(mocks.map.skipWhile(function (t) {
        return t[0] <= limit;
    }).count(), count, 'Test skipWhile numbers in a Map are less than 10');

    assert.equal(mocks.dictionary.skipWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test skipWhile numbers in a Dictionary are less than 10');

    assert.equal(mocks.lookup.skipWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test skipWhile numbers in a Lookup are less than 10');

    assert.equal(mocks.sortedList.skipWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test skipWhile numbers in a SortedList are less than 10');
});


qtest('"skip-while" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).skipWhile();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).skipWhile(1);
    }, 'non-function predicate');
});