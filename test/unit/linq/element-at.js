import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-element-at');

qtest('basic "element-at" test', function (assert) {
    assert.equal(mx(mocks.array).elementAt(0), 1, 'first element of an array of numbers');
    assert.equal(mx(mocks.array).elementAt(4), 5, 'last element of an array of numbers');
});



qtest('collections "element-at" method tests', function (assert) {
    assert.equal(mocks.collection.elementAt(0), 1, 'first element in a Collection');
    assert.equal(mocks.collection.elementAt(4), 5, 'last element in a Collection');

    assert.equal(mocks.list.elementAt(0), 1, 'first element in a List');
    assert.equal(mocks.list.elementAt(4), 5, 'last element in a List');

    assert.equal(mocks.readOnlyCollection.elementAt(0), 1, 'first element in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.elementAt(4), 5, 'last element in a ReadOnlyCollection');

    assert.equal(mocks.linkedList.elementAt(0), 1, 'first element in a LinkedList');
    assert.equal(mocks.linkedList.elementAt(4), 5, 'last element in a LinkedList');

    assert.equal(mocks.hashSet.elementAt(0), 1, 'first element in a HashSet');
    assert.equal(mocks.hashSet.elementAt(4), 5, 'last element in a HashSet');

    assert.equal(mocks.stack.elementAt(0), 1, 'first element in a Stack');
    assert.equal(mocks.stack.elementAt(4), 5, 'last element in a Stack');

    assert.equal(mocks.queue.elementAt(0), 1, 'first element in a Queue');
    assert.equal(mocks.queue.elementAt(4), 5, 'last element in a Queue');

    assert.equal(mocks.set.elementAt(0), 1, 'first element in a Set');
    assert.equal(mocks.set.elementAt(4), 5, 'last element in a Set');

    assert.equal(mocks.map.elementAt(0)[0], 1, 'first element in a Map');
    assert.equal(mocks.map.elementAt(4)[0], 5, 'last element in a Map');

    assert.equal(mocks.dictionary.elementAt(0).key, 1, 'first element in a Dictionary');
    assert.equal(mocks.dictionary.elementAt(4).key, 5, 'last element in a Dictionary');

    assert.equal(mocks.lookup.elementAt(0).key, 1, 'first element in a Lookup');
    assert.equal(mocks.lookup.elementAt(4).key, 5, 'last element in a Lookup');

    assert.equal(mocks.sortedList.elementAt(0).key, 1, 'first element in a SortedList');
    assert.equal(mocks.sortedList.elementAt(4).key, 5, 'last element in a SortedList');
});



qtest('"element-at" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).elementAt();
    }, 'null index');

    assert.throws(function () {
        mx([1]).elementAt(true);
    }, 'non-numeric index');

    assert.throws(function () {
        mx([1]).elementAt(-1);
    }, 'negative index');

    assert.throws(function () {
        mx([]).elementAt(0);
    }, 'empty iterable index');

    assert.throws(function () {
        mx([1]).elementAt(2);
    }, 'index out of range');
});