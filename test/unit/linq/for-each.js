import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-for-each');

function accumulateTest(source, selector) {
    var sum = 0;

    mx(source).forEach(function (item) {
        sum += (selector ? selector(item) : item);
    });

    return sum === mx(source).sum(selector);
}

function indexTest(source) {
    var res = true;
    var i = 0;

    mx(source).forEach(function (item, index) {
        res = res & (i === index);
        i++;
    });

    return res;
}


qtest('basic "forEach" test', function (assert) {
    assert.ok(accumulateTest(mocks.array), 'Test forEach on a array of numbers');
    assert.ok(indexTest(mocks.array), 'Test forEach index on a array of numbers');

    var res, thisArg = {};
    mx([1]).forEach(function () {
        res = (this === thisArg);
    }, thisArg);

    assert.ok(res, 'Test forEach thisArg');
});


qtest('collections "forEach" method tests', function (assert) {
    assert.ok(accumulateTest(mocks.collection), 'Test forEach in a Collection');
    assert.ok(indexTest(mocks.collection), 'Test forEach index in a Collection');

    assert.ok(accumulateTest(mocks.list), 'Test forEach in a List');
    assert.ok(indexTest(mocks.list), 'Test forEach index in a List');

    assert.ok(accumulateTest(mocks.readOnlyCollection), 'Test forEach in a ReadOnlyCollection');
    assert.ok(indexTest(mocks.readOnlyCollection), 'Test forEach index in a ReadOnlyCollection');

    assert.ok(accumulateTest(mocks.linkedList), 'Test forEach in a LinkedList');
    assert.ok(indexTest(mocks.linkedList), 'Test forEach index in a LinkedList');

    assert.ok(accumulateTest(mocks.hashSet), 'Test forEach in a HashSet');
    assert.ok(indexTest(mocks.hashSet), 'Test forEach index in a HashSet');

    assert.ok(accumulateTest(mocks.stack), 'Test forEach in a Stack');
    assert.ok(indexTest(mocks.stack), 'Test forEach index in a Stack');

    assert.ok(accumulateTest(mocks.queue), 'Test forEach in a Queue');
    assert.ok(indexTest(mocks.queue), 'Test forEach index in a Queue');

    assert.ok(accumulateTest(mocks.dictionary, function (t) {
        return t.key;
    }), 'Test forEach in a Dictionary');
    assert.ok(indexTest(mocks.dictionary), 'Test forEach index in a Dictionary');

    assert.ok(accumulateTest(mocks.lookup, function (t) {
        return t.key;
    }), 'Test forEach in a Lookup');
    assert.ok(indexTest(mocks.lookup), 'Test forEach index in a Lookup');

    assert.ok(accumulateTest(mocks.sortedList, function (t) {
        return t.key;
    }), 'Test forEach in a SortedList');
    assert.ok(indexTest(mocks.sortedList), 'Test forEach index in a SortedList');
});