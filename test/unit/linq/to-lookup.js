import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-to-lookup');

function identity(t) {
    return t;
}


qtest('basic "to-lookup" tests', function (assert) {
    var lookup = mx(mocks.array).toLookup(identity);

    assert.ok(lookup.count() === mocks.array.length, 'Test toLookup numbers in an array');
    assert.ok(lookup.contains(1), 'Test keys of toLookup method in an array');
    assert.ok(lookup.get(1), 'Test values of toLookup method in an array');
    assert.ok(mx([]).toLookup(identity).count() === 0, 'Test toLookup in an empty array');
});


qtest('equalityComparer "to-lookup" test', function (assert) {
    var comparer = {
        hash: function (o) {
            return o.val;
        },
        equals: function (a, b) {
            return a.val === b.val && a.index === b.index;
        }
    };

    assert.equal(mx([{ val: 1, index: 1 }, { val: 1, index: 2 }])
        .toLookup(identity, identity, comparer).count(), 2, 'Test toLookup an array of objects with equality comparer');
});


qtest('hash/equals override "to-lookup" test', function (assert) {
    assert.equal(mx([new mocks.Basic(1, 'A'), new mocks.Basic(2, 'B'), new mocks.Basic(1, 'C')])
        .toLookup(identity).count(), 3, 'Test toLookup in an array of objects overriding hash/equals methods');
});


qtest('collections "to-lookup" method tests', function (assert) {
    var len = mocks.array.length;

    assert.equal(mx(mocks.array).toLookup(identity).count(), len, 'Test toLookup in an array');
    assert.equal(mx(mocks.array).toLookup(identity, identity).count(), len, 'Test toLookup in an array with key and value selector');

    assert.equal(mocks.enumerable.toLookup(identity).count(), len, 'Test toLookup in an enumerable');
    assert.equal(mocks.enumerable.toLookup(identity, identity).count(), len, 'Test toLookup in an enumerable with key and value selector');

    assert.equal(mocks.collection.toLookup(identity).count(), len, 'Test toLookup in a Collection');
    assert.equal(mocks.collection.toLookup(identity, identity).count(), len, 'Test toLookup in a Collection with key and value selector');

    assert.equal(mocks.list.toLookup(identity).count(), len, 'Test toLookup in a List');
    assert.equal(mocks.list.toLookup(identity, identity).count(), len, 'Test toLookup in a List with key and value selector');

    assert.equal(mocks.readOnlyCollection.toLookup(identity).count(), len, 'Test toLookup in a ReadOnlyCollection');
    assert.equal(mocks.readOnlyCollection.toLookup(identity, identity).count(), len, 'Test toLookup in a ReadOnlyCollection with key and value selector');

    assert.equal(mocks.linkedList.toLookup(identity).count(), len, 'Test toLookup in a LinkedList');
    assert.equal(mocks.linkedList.toLookup(identity, identity).count(), len, 'Test toLookup in a LinkedList with key and value selector');

    assert.equal(mocks.hashSet.toLookup(identity).count(), len, 'Test toLookup in a HashSet');
    assert.equal(mocks.hashSet.toLookup(identity, identity).count(), len, 'Test toLookup in a HashSet with key and value selector');

    assert.equal(mocks.stack.toLookup(identity).count(), len, 'Test toLookup in a Stack');
    assert.equal(mocks.stack.toLookup(identity, identity).count(), len, 'Test toLookup in a Stack with key and value selector');

    assert.equal(mocks.queue.toLookup(identity).count(), len, 'Test toLookup in a Queue');
    assert.equal(mocks.queue.toLookup(identity, identity).count(), len, 'Test toLookup in a Queue with key and value selector');

    assert.equal(mocks.set.toLookup(identity).count(), len, 'Test toLookup in a Set');
    assert.equal(mocks.set.toLookup(identity, identity).count(), len, 'Test toLookup in a Set with key and value selector');

    assert.equal(mocks.map.toLookup(identity).count(), len, 'Test toLookup in a Map');
    assert.equal(mocks.map.toLookup(identity, identity).count(), len, 'Test toLookup in a Map with key and value selector');

    assert.equal(mocks.dictionary.toLookup(identity).count(), len, 'Test toLookup in a Dictionary');
    assert.equal(mocks.dictionary.toLookup(identity, identity).count(), len, 'Test toLookup in a Dictionary with key and value selector');

    assert.equal(mocks.lookup.toLookup(identity).count(), len, 'Test toLookup in a Lookup');
    assert.equal(mocks.lookup.toLookup(identity, identity).count(), len, 'Test toLookup in a Lookup with key and value selector');

    assert.equal(mocks.sortedList.toLookup(identity).count(), len, 'Test toLookup in a SortedList');
    assert.equal(mocks.sortedList.toLookup(identity, identity).count(), len, 'Test toLookup in a SortedList with key and value selector');
});



qtest('"to-lookup" method validations', function (assert) {
    assert.throws(function () {
        mx([1]).toLookup();
    }, 'without key selector');

    assert.throws(function () {
        mx([1]).toLookup(1);
    }, 'non-function key selector');

    assert.throws(function () {
        mx([1]).toLookup(identity, 1);
    }, 'non-function value selector');
});