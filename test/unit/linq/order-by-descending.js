import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-order-by-descending');

function identity(t) {
    return t;
}

qtest('basic "order-by-descending" tests', function (assert) {
    assert.equal(mx.range(0, 50).orderByDescending(identity).toArray()[0], 49, 'Test orderByDescending for array of numbers');
    assert.equal(mx('string').orderByDescending(identity).last(), 'g', 'Test orderByDescending for array of string');

    assert.deepEqual(mx([{ a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }])
        .orderByDescending(function (t) {
            return t.a;
        })
        .thenBy(function (t) {
            return t.b;
        })
        .thenByDescending(function (t) {
            return t.c;
        })
        .toArray(), [{ a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }, { a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }], 'Test orderByDescending for array of objects');
});


qtest('collections "order-by-descending" method tests', function (assert) {
    assert.equal(mocks.enumerable.orderByDescending(identity).last(), 1, 'Test orderByDescending for an enumerable');
});


qtest('"order-by-descending" toString tests', function (assert) {
    assert.equal(mocks.enumerable.orderByDescending(identity).toString(), '[Ordered Iterable]', 'Test orderByDescending toString');
});