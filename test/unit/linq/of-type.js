import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-of-type');

qtest('basic "of-type" test', function (assert) {
    assert.equal(mx(mocks.array).ofType(Number).count(), mocks.array.length, 'ofType Number in an array of numbers');
    assert.equal(mx(mocks.array).ofType(String).count(), 0, 'ofType String in an array of numbers');
    assert.equal(mx('string').ofType(String).count(), 'string'.length, 'ofType String in an array of String');
    assert.equal(mx('string').ofType(Number).count(), 0, 'ofType Number in an array of numbers');
});

qtest('collections "of-type" method tests', function (assert) {
    var len = mocks.array.length;
    assert.equal(mx(mocks.array).ofType(Number).count(), len, 'Test toList in an array');
    assert.equal(mocks.enumerable.ofType(Number).count(), len, 'Test toList in an enumerable');
    assert.equal(mocks.collection.ofType(Number).count(), len, 'Test toList in a Collection');
    assert.equal(mocks.list.ofType(Number).count(), len, 'Test toList in a List');
    assert.equal(mocks.readOnlyCollection.ofType(Number).count(), len, 'Test toList in a ReadOnlyCollection');
    assert.equal(mocks.linkedList.ofType(Number).count(), len, 'Test toList in a LinkedList');
    assert.equal(mocks.hashSet.ofType(Number).count(), len, 'Test toList in a HashSet');
    assert.equal(mocks.stack.ofType(Number).count(), len, 'Test toList in a Stack');
    assert.equal(mocks.queue.ofType(Number).count(), len, 'Test toList in a Queue');
});
