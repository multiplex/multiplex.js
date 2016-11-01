import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-contains');


qtest('basic "contains" test', function (assert) {
    assert.ok(mx(mocks.array).contains(1), 'Test an array contains a number');
    assert.ok(!mx(mocks.array).contains(0), 'Test an array does not containy a number');
});


qtest('equalityComparer "contains" test', function (assert) {
    assert.ok(mx([{ val: 1 }]).contains({ val: 1 }, {
        equals: function (a, b) {
            return a.val === b.val;
        }
    }), 'Test an array of objects contains a value');

    assert.ok(!mx([{ val: 1 }]).contains({ val: 2 }, {
        equals: function (a, b) {
            return a.val === b.val;
        }
    }), 'Test an array of objects non containing a value');
});


qtest('collections "contains" method tests', function (assert) {
    assert.ok(mocks.collection.contains(1), 'Test "contains" in a Collection');
    assert.ok(!mocks.collection.contains(0), 'Test does not contain in a Collection');

    assert.ok(mocks.list.contains(1), 'Test "contains" in a List');
    assert.ok(!mocks.list.contains(0), 'Test does not contain in a List');

    assert.ok(mocks.readOnlyCollection.contains(1), 'Test "contains" in a ReadOnlyCollection');
    assert.ok(!mocks.readOnlyCollection.contains(0), 'Test does not contain in a ReadOnlyCollection');

    assert.ok(mocks.linkedList.contains(1), 'Test "contains" in a LinkedList');
    assert.ok(!mocks.linkedList.contains(0), 'Test does not contain in a LinkedList');

    assert.ok(mocks.hashSet.contains(1), 'Test "contains" in a HashSet');
    assert.ok(!mocks.hashSet.contains(0), 'Test does not contain in a HashSet');

    assert.ok(mocks.stack.contains(1), 'Test "contains" in a Stack');
    assert.ok(!mocks.stack.contains(0), 'Test does not contain in a Stack');

    assert.ok(mocks.queue.contains(1), 'Test "contains" in a Queue');
    assert.ok(!mocks.queue.contains(0), 'Test does not contain in a Queue');

    assert.ok(mocks.set.contains(1), 'Test "contains" in a Set');
    assert.ok(!mocks.set.contains(0), 'Test does not contain in a Set');

    var mapComparer = {
        hash: function (t) {
            return t[0];
        },
        equals: function (a, b) {
            return this.hash(a[0]) === this.hash(b[0]) && a[0] === b[0];
        }
    };

    var keyValuePairComparer = {
        hash: function (t) {
            return t.key;
        },
        equals: function (a, b) {
            return this.hash(a.key) === this.hash(b.key) && a.key === b.key;
        }
    };

    assert.ok(mocks.map.contains([1, 1], mapComparer), 'Test "contains" in a Map');
    assert.ok(!mocks.map.contains([0, 0], mapComparer), 'Test does not contain in a Map');

    assert.ok(mocks.dictionary.contains({ key: 1, value: 1 }, keyValuePairComparer), 'Test "contains" in a Dictionary');
    assert.ok(!mocks.dictionary.contains({ key: 0, value: 0 }, keyValuePairComparer), 'Test does not contain in a Dictionary');

    assert.ok(mocks.lookup.contains(1), 'Test "contains" in a Lookup');
    assert.ok(!mocks.lookup.contains(0), 'Test does not contain in a Lookup');

    assert.ok(mocks.sortedList.contains({ key: 1, value: 1 }, keyValuePairComparer), 'Test "contains" in a SortedList');
    assert.ok(!mocks.sortedList.contains({ key: 0, value: 0 }, keyValuePairComparer), 'Test does not contain in a SortedList');
});