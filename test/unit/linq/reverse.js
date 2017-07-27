import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-reverse');

var reversed = mocks.array.concat().reverse();


qtest('basic "reverse" test', function (assert) {
    assert.equal(mx([]).reverse().count(), 0, 'reverse of an empty array');
    assert.deepEqual(mx(mocks.array).reverse().toArray(), reversed, 'reverse of an array of numbers');
    assert.deepEqual(mx('abcd').reverse().toArray(), ['d', 'c', 'b', 'a'], 'reverse of an array of string');
    assert.deepEqual(mx([true, false, false]).reverse().toArray(), [false, false, true], 'reverse of an array of booleans');
    assert.deepEqual(mx([new Date(2016, 1, 1), new Date(2017, 1, 1), new Date(2018, 1, 1)]).reverse().toArray(), [new Date(2018, 1, 1), new Date(2017, 1, 1), new Date(2016, 1, 1)], 'reverse of an array of date');
});


qtest('collections "reverse" method tests', function (assert) {
    assert.deepEqual(mocks.enumerable.reverse().toArray(), reversed, 'Test "reverse" in an enumerable');
    assert.deepEqual(mocks.collection.reverse().toArray(), reversed, 'Test "reverse" in a Collection');
    assert.deepEqual(mocks.list.reverse().toArray(), reversed, 'Test "reverse" in a List');
    assert.deepEqual(mocks.readOnlyCollection.reverse().toArray(), reversed, 'Test "reverse" in a ReadOnlyCollection');
    assert.deepEqual(mocks.linkedList.reverse().toArray(), reversed, 'Test "reverse" in a LinkedList');
    assert.deepEqual(mocks.hashSet.reverse().toArray(), reversed, 'Test "reverse" in a HashSet');
    assert.deepEqual(mocks.stack.reverse().toArray(), reversed, 'Test "reverse" in a Stack');
    assert.deepEqual(mocks.queue.reverse().toArray(), reversed, 'Test "reverse" in a Queue');
    assert.deepEqual(mocks.set.reverse().toArray(), reversed, 'Test "reverse" in a Set');

    assert.equal(mocks.map.reverse().toArray()[0][0], 5, 'Test "reverse" in a Map');
    assert.equal(mocks.dictionary.reverse().toArray()[0].key, 5, 'Test "reverse" in a Dictionary');
    assert.equal(mocks.lookup.reverse().toArray()[0].key, 5, 'Test "reverse" in a Lookup');
    assert.equal(mocks.sortedList.reverse().toArray()[0].key, 5, 'Test "reverse" in a SortedList');
});