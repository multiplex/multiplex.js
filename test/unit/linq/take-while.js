import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-take-while');

var limit = 3;
var count = limit;
function simpleNumericPredicate(t) {
    return t <= limit;
}

qtest('basic "take-while" test', function (assert) {
    assert.equal(mx(mocks.array).takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in an array are less than 10');
    assert.equal(mx(mocks.enumerable).takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in an enumerable are less than 10');

    assert.equal(mx(mocks.array).takeWhile(function (t) {
        return t < 10;
    }).count(), mocks.array.length, 'Test takeWhile numbers in an array are less than 10');

    assert.equal(mx(mocks.array).takeWhile(function (t) {
        return t > 10;
    }).count(), 0, 'Test takeWhile numbers in an array are greater than 10');

    assert.equal(mx([]).takeWhile(simpleNumericPredicate).count(), 0, 'Test takeWhile over an empty iterable results false');
});


qtest('collections "take-while" method tests', function (assert) {
    assert.equal(mocks.collection.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Collection are less than 10');
    assert.equal(mocks.list.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a List are less than 10');
    assert.equal(mocks.readOnlyCollection.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a ReadOnlyCollection are less than 10');
    assert.equal(mocks.linkedList.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a LinkedList are less than 10');
    assert.equal(mocks.hashSet.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a HashSet are less than 10');
    assert.equal(mocks.stack.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Stack are less than 10');
    assert.equal(mocks.queue.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Queue are less than 10');
    assert.equal(mocks.set.takeWhile(simpleNumericPredicate).count(), count, 'Test takeWhile numbers in a Set are less than 10');

    assert.equal(mocks.map.takeWhile(function (t) {
        return t[0] <= limit;
    }).count(), count, 'Test takeWhile numbers in a Map are less than 10');

    assert.equal(mocks.dictionary.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a Dictionary are less than 10');

    assert.equal(mocks.lookup.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a Lookup are less than 10');

    assert.equal(mocks.sortedList.takeWhile(function (t) {
        return t.key <= limit;
    }).count(), count, 'Test takeWhile numbers in a SortedList are less than 10');
});


qtest('"take-while" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).takeWhile();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).takeWhile(1);
    }, 'non-function predicate');
});