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
    assert.equal(mx(mocks.collection).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Collection');
    assert.equal(mx(mocks.collection).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Collection');

    assert.equal(mx(mocks.list).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a List');
    assert.equal(mx(mocks.list).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a List');

    assert.equal(mx(mocks.readOnlyCollection).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a ReadOnlyCollection');
    assert.equal(mx(mocks.readOnlyCollection).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a ReadOnlyCollection');

    assert.equal(mx(mocks.linkedList).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a LinkedList');
    assert.equal(mx(mocks.linkedList).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a LinkedList');

    assert.equal(mx(mocks.hashSet).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a HashSet');
    assert.equal(mx(mocks.hashSet).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a HashSet');

    assert.equal(mx(mocks.stack).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Stack');
    assert.equal(mx(mocks.stack).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Stack');

    assert.equal(mx(mocks.queue).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Queue');
    assert.equal(mx(mocks.queue).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Queue');

    assert.equal(mx(mocks.set).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Set');
    assert.equal(mx(mocks.set).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Set');

    assert.equal(mx(mocks.map).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Map');
    assert.equal(mx(mocks.map).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Map');

    assert.equal(mx(mocks.dictionary).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Dictionary');
    assert.equal(mx(mocks.dictionary).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Dictionary');

    assert.equal(mx(mocks.lookup).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a Lookup');
    assert.equal(mx(mocks.lookup).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a Lookup');

    assert.equal(mx(mocks.sortedList).concat([]).toArray().length, 5, 'Test "concat" with an empty array in a SortedList');
    assert.equal(mx(mocks.sortedList).concat(mocks.collection).toArray().length, 10, 'Test "concat" in a SortedList');
});


qtest('concat method validations', function (assert) {
    assert.throws(function () {
        mx([1]).concat();
    }, 'null input');
});