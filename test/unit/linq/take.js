import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-take');



qtest('basic take test', function (assert) {
    assert.equal(mx(mocks.array).take(2).count(), 2, 'Test take in an array');
    assert.equal(mx([]).take(2).count(), 0, 'Test take empty array');
    assert.equal(mx(mocks.array).take(10).count(), mocks.array.length, 'Test take more than array size');
    assert.equal(mx(mocks.array).take(-10).count(), 0, 'Test take negative number');

    assert.deepEqual(mx([1, 2, 3, 4]).take(2).toArray(), [1, 2], 'Test take values on array');
    assert.deepEqual(mx.range(1, 4).take(2).toArray(), [1, 2], 'Test take values on array');
});


qtest('collections take method tests', function (assert) {
    var count = 2;
    assert.equal(mx(mocks.enumerable).take(count).count(), count, 'Test take numbers in an enumerable are less than 10');
    assert.equal(mocks.collection.take(count).count(), count, 'Test take numbers in a Collection are less than 10');
    assert.equal(mocks.list.take(count).count(), count, 'Test take numbers in a List are less than 10');
    assert.equal(mocks.readOnlyCollection.take(count).count(), count, 'Test take numbers in a ReadOnlyCollection are less than 10');
    assert.equal(mocks.linkedList.take(count).count(), count, 'Test take numbers in a LinkedList are less than 10');
    assert.equal(mocks.hashSet.take(count).count(), count, 'Test take numbers in a HashSet are less than 10');
    assert.equal(mocks.stack.take(count).count(), count, 'Test take numbers in a Stack are less than 10');
    assert.equal(mocks.queue.take(count).count(), count, 'Test take numbers in a Queue are less than 10');
    assert.equal(mocks.set.take(count).count(), count, 'Test take numbers in a Set are less than 10');
    assert.equal(mocks.map.take(count).count(), count, 'Test take numbers in a Map are less than 10');
    assert.equal(mocks.dictionary.take(count).count(), count, 'Test take numbers in a Dictionary are less than 10');
    assert.equal(mocks.lookup.take(count).count(), count, 'Test take numbers in a Lookup are less than 10');
    assert.equal(mocks.sortedList.take(count).count(), count, 'Test take numbers in a SortedList are less than 10');
});


qtest('take method validations', function (assert) {
    assert.throws(function () {
        mx([1]).take('a');
    }, 'non number count');
});