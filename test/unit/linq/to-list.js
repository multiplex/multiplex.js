import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-to-list');

qtest('collections to-list method tests', function (assert) {
    var len = mocks.array.length;
    assert.equal(mx(mocks.array).toList().count(), len, 'Test toList in an array');
    assert.equal(mocks.enumerable.toList().count(), len, 'Test toList in an enumerable');
    assert.equal(mocks.collection.toList().count(), len, 'Test toList in a Collection');
    assert.equal(mocks.list.toList().count(), len, 'Test toList in a List');
    assert.equal(mocks.readOnlyCollection.toList().count(), len, 'Test toList in a ReadOnlyCollection');
    assert.equal(mocks.linkedList.toList().count(), len, 'Test toList in a LinkedList');
    assert.equal(mocks.hashSet.toList().count(), len, 'Test toList in a HashSet');
    assert.equal(mocks.stack.toList().count(), len, 'Test toList in a Stack');
    assert.equal(mocks.queue.toList().count(), len, 'Test toList in a Queue');
    assert.equal(mocks.set.toList().count(), len, 'Test toList in a Set');
    assert.equal(mocks.map.toList().count(), len, 'Test toList in a Map');
    assert.equal(mocks.dictionary.toList().count(), len, 'Test toList in a Dictionary');
    assert.equal(mocks.lookup.toList().count(), len, 'Test toList in a Lookup');
    assert.equal(mocks.sortedList.toList().count(), len, 'Test toList in a SortedList');
});
