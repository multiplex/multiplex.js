import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-to-dictionary');

function identity(t) {
    return t;
}


qtest('basic "to-dictionary" tests', function (assert) {
    var dic = mx(mocks.array).toDictionary(identity);

    assert.ok(dic.count() === mocks.array.length, 'Test toDictionary numbers in an array');
    assert.ok(dic.keys().count() === mocks.array.length, 'Test toDictionary keys count in an array');
    assert.ok(dic.values().count() === mocks.array.length, 'Test toDictionary values count in an array');
    assert.ok(dic.containsKey(1), 'Test keys of toDictionary method in an array');
    assert.ok(dic.containsValue(1), 'Test values of toDictionary method in an array');
    assert.ok(!dic.containsKey('a'), 'Test not exsiatnce of the values of toDictionary method in an array');
    assert.ok(mx([]).toDictionary(identity).count() === 0, 'Test toDictionary in an empty array');
});


qtest('equalityComparer "to-dictionary" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val && a.index === b.index;
        }
    };

    assert.equal(mx([{ val: 1, index: 1 }, { val: 1, index: 2 }])
        .toDictionary(identity, identity, comparer).count(), 2, 'Test toDictionary an array of objects with equality comparer');
});


qtest('hash/equals override "to-dictionary" test', function (assert) {
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B'), new mocks.Basic(1, 'C')])
        .toDictionary(identity).count(), 3, 'Test toDictionary in an array of objects overriding hash/equals methods');
});


qtest('collections "to-dictionary" method tests', function (assert) {
    var len = mocks.array.length;

    assert.equal(mx(mocks.array).toDictionary(identity).count(), len, 'Test toDictionary in an array');
    assert.equal(mx(mocks.array).toDictionary(identity, identity).count(), len, 'Test toDictionary in an array with key and value selector');

    assert.equal(mocks.enumerable.toDictionary(identity).count(), len, 'Test toDictionary in an enumerable');
    assert.equal(mocks.enumerable.toDictionary(identity, identity).count(), len, 'Test toDictionary in an enumerable with key and value selector');

    assert.equal(mocks.collection.toDictionary(identity).count(), len, 'Test toDictionary in a Collection');
    assert.equal(mocks.collection.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Collection with key and value selector');

    assert.equal(mocks.list.toDictionary(identity).count(), len, 'Test toDictionary in a List');
    assert.equal(mocks.list.toDictionary(identity, identity).count(), len, 'Test toDictionary in a List with key and value selector');

    assert.equal(mocks.readOnlyCollection.toDictionary(identity).count(), len, 'Test toDictionary in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.toDictionary(identity, identity).count(), len, 'Test toDictionary in a ReadOnlyCollection with key and value selector');

    assert.equal(mocks.linkedList.toDictionary(identity).count(), len, 'Test toDictionary in a LinkedList');
    assert.equal(mocks.linkedList.toDictionary(identity, identity).count(), len, 'Test toDictionary in a LinkedList with key and value selector');

    assert.equal(mocks.hashSet.toDictionary(identity).count(), len, 'Test toDictionary in a HashSet');
    assert.equal(mocks.hashSet.toDictionary(identity, identity).count(), len, 'Test toDictionary in a HashSet with key and value selector');

    assert.equal(mocks.stack.toDictionary(identity).count(), len, 'Test toDictionary in a Stack');
    assert.equal(mocks.stack.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Stack with key and value selector');

    assert.equal(mocks.queue.toDictionary(identity).count(), len, 'Test toDictionary in a Queue');
    assert.equal(mocks.queue.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Queue with key and value selector');

    assert.equal(mocks.set.toDictionary(identity).count(), len, 'Test toDictionary in a Set');
    assert.equal(mocks.set.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Set with key and value selector');

    assert.equal(mocks.map.toDictionary(identity).count(), len, 'Test toDictionary in a Map');
    assert.equal(mocks.map.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Map with key and value selector');

    assert.equal(mocks.dictionary.toDictionary(identity).count(), len, 'Test toDictionary in a Dictionary');
    assert.equal(mocks.dictionary.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Dictionary with key and value selector');

    assert.equal(mocks.lookup.toDictionary(identity).count(), len, 'Test toDictionary in a Lookup');
    assert.equal(mocks.lookup.toDictionary(identity, identity).count(), len, 'Test toDictionary in a Lookup with key and value selector');

    assert.equal(mocks.sortedList.toDictionary(identity).count(), len, 'Test toDictionary in a SortedList');
    assert.equal(mocks.sortedList.toDictionary(identity, identity).count(), len, 'Test toDictionary in a SortedList with key and value selector');
});



qtest('toDictionary method validations', function (assert) {
    assert.throws(function () {
        mx([1]).toDictionary();
    }, 'without key selector');

    assert.throws(function () {
        mx([1]).toDictionary(1);
    }, 'non-function key selector');

    assert.throws(function () {
        mx([1]).toDictionary(identity, 1);
    }, 'non-function value selector');

    assert.throws(function () {
        mx([1, 1]).toDictionary(identity);
    }, 'duplicate keys');
});