import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-default-if-empty');

qtest('basic "defaultIfEmpty" test', function (assert) {
    assert.equal(mx(mocks.array).defaultIfEmpty().count(), 5, 'defaultIfEmpty on a non-empty array');
    assert.equal(mx([]).defaultIfEmpty(1).toArray()[0], 1, 'defaultIfEmpty on an empty array');
});

qtest('collections "defaultIfEmpty" method tests', function (assert) {
    assert.equal(mocks.collection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Collection');
    assert.equal(new mx.Collection().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Collection');

    assert.equal(mocks.list.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a List');
    assert.equal(new mx.List().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty List');

    assert.equal(mocks.readOnlyCollection.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a ReadOnlyCollection');
    assert.equal(new mx.ReadOnlyCollection([]).defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty ReadOnlyCollection');

    assert.equal(mocks.linkedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a LinkedList');
    assert.equal(new mx.LinkedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty LinkedList');

    assert.equal(mocks.hashSet.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a HashSet');
    assert.equal(new mx.HashSet().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty HashSet');

    assert.equal(mocks.stack.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Stack');
    assert.equal(new mx.Stack().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Stack');

    assert.equal(mocks.queue.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Queue');
    assert.equal(new mx.Queue().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Queue');

    assert.equal(mocks.set.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Set');
    assert.equal(new mx.Set().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Set');

    assert.equal(mocks.map.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Map');
    assert.equal(new mx.Map().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty Map');

    assert.equal(mocks.dictionary.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Dictionary');
    assert.equal(mocks.lookup.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a Lookup');

    assert.equal(mocks.sortedList.defaultIfEmpty().count(), 5, 'Test "defaultIfEmpty" in a SortedList');
    assert.equal(new mx.SortedList().defaultIfEmpty().count(), 1, 'Test "defaultIfEmpty" in an empty SortedList');
});