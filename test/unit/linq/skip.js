import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-skip');



qtest('basic skip test', function (assert) {
    assert.equal(mx(mocks.array).skip(2).count(), mocks.array.length - 2, 'Test skip in an array');
    assert.equal(mx([]).skip(2).count(), 0, 'Test skip empty array');
    assert.equal(mx(mocks.array).skip(10).count(), 0, 'Test skip more than array size');
    assert.equal(mx(mocks.array).skip(-10).count(), mocks.array.length, 'Test skip negative number');

    assert.deepEqual(mx([1, 2, 3, 4]).skip(2).toArray(), [3, 4], 'Test skip values on array');
    assert.deepEqual(mx.range(1, 4).skip(2).toArray(), [3, 4], 'Test skip values on array');
});


qtest('collections skip method tests', function (assert) {
    var count = 2;
    var len = mocks.array.length - 2;
    assert.equal(mx(mocks.enumerable).skip(count).count(), len, 'Test skip numbers in an enumerable are less than 10');
    assert.equal(mocks.collection.skip(count).count(), len, 'Test skip numbers in a Collection are less than 10');
    assert.equal(mocks.list.skip(count).count(), len, 'Test skip numbers in a List are less than 10');
    assert.equal(mocks.readOnlyCollection.skip(count).count(), len, 'Test skip numbers in a ReadOnlyCollection are less than 10');
    assert.equal(mocks.linkedList.skip(count).count(), len, 'Test skip numbers in a LinkedList are less than 10');
    assert.equal(mocks.hashSet.skip(count).count(), len, 'Test skip numbers in a HashSet are less than 10');
    assert.equal(mocks.stack.skip(count).count(), len, 'Test skip numbers in a Stack are less than 10');
    assert.equal(mocks.queue.skip(count).count(), len, 'Test skip numbers in a Queue are less than 10');
    assert.equal(mocks.set.skip(count).count(), len, 'Test skip numbers in a Set are less than 10');
    assert.equal(mocks.map.skip(count).count(), len, 'Test skip numbers in a Map are less than 10');
    assert.equal(mocks.dictionary.skip(count).count(), len, 'Test skip numbers in a Dictionary are less than 10');
    assert.equal(mocks.lookup.skip(count).count(), len, 'Test skip numbers in a Lookup are less than 10');
    assert.equal(mocks.sortedList.skip(count).count(), len, 'Test skip numbers in a SortedList are less than 10');
});


qtest('skip method validations', function (assert) {
    assert.throws(function () {
        mx([1]).skip('a');
    }, 'non number count');
});