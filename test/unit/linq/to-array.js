import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-to-array');

qtest('collections to-array method tests', function (assert) {
    var len = mocks.array.length;
    assert.equal(mx(mocks.array).toArray().length, len, 'Test toArray in an array');
    assert.equal(mocks.enumerable.toArray().length, len, 'Test toArray in an array');
    assert.equal(mocks.collection.toArray().length, len, 'Test toArray in a Collection');
    assert.equal(mocks.list.toArray().length, len, 'Test toArray in a List');
    assert.equal(mocks.readOnlyCollection.toArray().length, len, 'Test toArray in a ReadOnlyCollection');
    assert.equal(mocks.linkedList.toArray().length, len, 'Test toArray in a LinkedList');
    assert.equal(mocks.hashSet.toArray().length, len, 'Test toArray in a HashSet');
    assert.equal(mocks.stack.toArray().length, len, 'Test toArray in a Stack');
    assert.equal(mocks.queue.toArray().length, len, 'Test toArray in a Queue');
    assert.equal(mocks.set.toArray().length, len, 'Test toArray in a Set');
    assert.equal(mocks.map.toArray().length, len, 'Test toArray in a Map');
    assert.equal(mocks.dictionary.toArray().length, len, 'Test toArray in a Dictionary');
    assert.equal(mocks.lookup.toArray().length, len, 'Test toArray in a Lookup');
    assert.equal(mocks.sortedList.toArray().length, len, 'Test toArray in a SortedList');

    assert.deepEqual(mx(mocks.array).toArray(), mocks.array, 'Test toArray in an array');
    assert.deepEqual(mocks.enumerable.toArray(), mocks.array, 'Test toArray in an array');
    assert.deepEqual(mocks.collection.toArray(), mocks.array, 'Test toArray in a Collection');
    assert.deepEqual(mocks.list.toArray(), mocks.array, 'Test toArray in a List');
    assert.deepEqual(mocks.readOnlyCollection.toArray(), mocks.array, 'Test toArray in a ReadOnlyCollection');
    assert.deepEqual(mocks.linkedList.toArray(), mocks.array, 'Test toArray in a LinkedList');
    assert.deepEqual(mocks.hashSet.toArray(), mocks.array, 'Test toArray in a HashSet');
    assert.deepEqual(mocks.stack.toArray(), mocks.array, 'Test toArray in a Stack');
    assert.deepEqual(mocks.queue.toArray(), mocks.array, 'Test toArray in a Queue');
    assert.deepEqual(mocks.set.toArray(), mocks.array, 'Test toArray in a Set');
});
