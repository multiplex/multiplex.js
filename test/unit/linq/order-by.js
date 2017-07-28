import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-order-by');

function identity(t) {
    return t;
}

qtest('basic "order-by" tests', function (assert) {
    assert.equal(mx.range(0, 50).orderBy(identity).toArray()[0], 0, 'Test orderBy for array of numbers');
    assert.equal(mx('string').orderBy(identity).last(), 't', 'Test orderBy for array of string');

    assert.deepEqual(mx([{ a: 2, b: 3, c: 1 }, { a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }])
        .orderBy(function (t) {
            return t.a;
        })
        .thenBy(function (t) {
            return t.b;
        })
        .thenByDescending(function (t) {
            return t.c;
        })
        .toArray(), [{ a: 1, b: 2, c: 3 }, { a: 2, b: 1, c: 3 }, { a: 2, b: 1, c: 2 }, { a: 2, b: 3, c: 1 }], 'Test orderBy for array of objects');
});

qtest('collections "order-by" method tests', function (assert) {
    assert.equal(mocks.enumerable.orderBy(identity).last(), 5, 'Test orderBy for an enumerable');
});