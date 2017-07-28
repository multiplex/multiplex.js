import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-select');


function double(t) {
    return t * 2;
}

var result = new Array(mocks.array.length);
for (var i = 0; i < mocks.array.length; i++) {
    result[i] = double(mocks.array[i]);
}

qtest('basic select test', function (assert) {
    assert.equal(mx(mocks.array).select(double).count(), mocks.array.length, 'Test select numbers in an array are less than 10');
    assert.equal(mx(mocks.enumerable).select(double).count(), mocks.array.length, 'Test select numbers in an enumerable are less than 10');

    var total = 10;
    var index = 0;
    mx.range(0, total).select(function (item, i) {
        index = i + 1;
    }).toArray();

    assert.equal(total, index, 'Test select callback function index argument');
});


qtest('collections select method tests', function (assert) {
    assert.deepEqual(mocks.enumerable.select(double).toArray(), result, 'Test select numbers in an enumerable are less than 10');
    assert.deepEqual(mocks.collection.select(double).toArray(), result, 'Test select numbers in a Collection are less than 10');
    assert.deepEqual(mocks.list.select(double).toArray(), result, 'Test select numbers in a List are less than 10');
    assert.deepEqual(mocks.readOnlyCollection.select(double).toArray(), result, 'Test select numbers in a ReadOnlyCollection are less than 10');
    assert.deepEqual(mocks.linkedList.select(double).toArray(), result, 'Test select numbers in a LinkedList are less than 10');
    assert.deepEqual(mocks.hashSet.select(double).toArray(), result, 'Test select numbers in a HashSet are less than 10');
    assert.deepEqual(mocks.stack.select(double).toArray(), result, 'Test select numbers in a Stack are less than 10');
    assert.deepEqual(mocks.queue.select(double).toArray(), result, 'Test select numbers in a Queue are less than 10');
    assert.deepEqual(mocks.set.select(double).toArray(), result, 'Test select numbers in a Set are less than 10');

    assert.deepEqual(mocks.map.select(function (t) {
        return double(t[0]);
    }).toArray(), result, 'Test select numbers in a Map are less than 10');

    assert.deepEqual(mocks.dictionary.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a Dictionary are less than 10');

    assert.deepEqual(mocks.lookup.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a Lookup are less than 10');

    assert.deepEqual(mocks.sortedList.select(function (t) {
        return double(t.key);
    }).toArray(), result, 'Test select numbers in a SortedList are less than 10');
});


qtest('select method validations', function (assert) {
    assert.throws(function () {
        mx([1]).select();
    }, 'without predicate');

    assert.throws(function () {
        mx([1]).select(1);
    }, 'non-function predicate');
});