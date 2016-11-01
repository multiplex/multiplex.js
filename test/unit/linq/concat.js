import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-concat');


qtest('basic "concat" test', function (assert) {
    assert.deepEqual(mx([]).concat([]).toArray(), [], 'concat two empty arrays');
    assert.deepEqual(mx([1, 2]).concat([]).toArray(), [1, 2], 'concat an array with empty array');
    assert.deepEqual(mx([1, 2]).concat([3, 4]).toArray(), [1, 2, 3, 4], 'concat two arrays');
    assert.deepEqual(mx([1, 2]).concat([1, 2]).toArray(), [1, 2, 1, 2], 'concat two identical arrays');
});


qtest('collections "concat" method tests', function (assert) {
    assert.equal(mocks.collection.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Collection');
    assert.equal(mocks.collection.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Collection');

    assert.equal(mocks.list.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a List');
    assert.equal(mocks.list.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a List');

    assert.equal(mocks.readOnlyCollection.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a ReadOnlyCollection');

    assert.equal(mocks.linkedList.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a LinkedList');
    assert.equal(mocks.linkedList.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a LinkedList');

    assert.equal(mocks.hashSet.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a HashSet');
    assert.equal(mocks.hashSet.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a HashSet');

    assert.equal(mocks.stack.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Stack');
    assert.equal(mocks.stack.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Stack');

    assert.equal(mocks.queue.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Queue');
    assert.equal(mocks.queue.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Queue');

    assert.equal(mocks.set.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Set');
    assert.equal(mocks.set.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Set');

    assert.equal(mocks.map.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Map');
    assert.equal(mocks.map.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Map');

    assert.equal(mocks.dictionary.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Dictionary');
    assert.equal(mocks.dictionary.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Dictionary');

    assert.equal(mocks.lookup.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Lookup');
    assert.equal(mocks.lookup.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Lookup');

    assert.equal(mocks.sortedList.concat([]).toArray().length, 5, 'Test "concat" with an empty array in a SortedList');
    assert.equal(mocks.sortedList.concat(mocks.collection).toArray().length, 10, 'Test "concat" in a SortedList');
});


qtest('concat method validations', function (assert) {
    assert.throws(function () {
        mx([1]).concat();
    }, 'null input');
});