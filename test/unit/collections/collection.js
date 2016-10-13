import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('collection');

var Collection = mx.Collection;

qtest('create collection', function (assert) {
    assert.equal(new Collection().valueOf(), undefined, 'empty collection');
    assert.equal(new Collection([1, 2, 3]).valueOf().length, 3, 'create collection from array');
    assert.equal(new Collection('string').valueOf().length, 6, 'create collection from string');
    assert.equal(new Collection(arguments).valueOf().length, 1, 'create collection from arguments');
    assert.equal(new Collection(new Collection([1])).valueOf().length, 1, 'create collection from another collection');
    assert.equal(new Collection(mx([1, 2, 3])).valueOf().length, 3, 'create collection from ArrayIterable');
    assert.equal(new Collection(mx({ val: 1 })).valueOf().length, 1, 'create collection from ObjectIterable');
    assert.equal(new Collection(mx.range(0, 1000).toArray()).valueOf().length, 1000, 'create collection from big array');

    assert.equal(new Collection(mx([1, 2, 3]).select(function (t) {
        return t * 2;
    })).valueOf().length, 3, 'create collection from Iterable');

    assert.equal(new Collection(function () {
        var index = 0;
        return new mx.Iterator(function () {
            if (index++ < 100) {
                return {
                    value: index,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }).valueOf().length, 100, 'create collection from Generator');
});


qtest('collection count', function (assert) {
    assert.equal(new Collection().count(), 0, 'empty collection');
    assert.equal(new Collection([1, 2, 3]).count(), 3, 'create collection from array');
    assert.equal(new Collection('string').count(), 6, 'create collection from string');
    assert.equal(new Collection(arguments).count(), 1, 'create collection from arguments');
    assert.equal(new Collection(new Collection([1])).count(), 1, 'create collection from another collection');
    assert.equal(new Collection(mx([1, 2, 3])).count(), 3, 'create collection from ArrayIterable');
    assert.equal(new Collection(mx({ val: 1 })).count(), 1, 'create collection from ObjectIterable');
    assert.equal(new Collection(mx.range(0, 1000).toArray()).count(), 1000, 'create collection from big array');

    assert.equal(new Collection(mx([1, 2, 3]).select(function (t) {
        return t * 2;
    })).count(), 3, 'create collection from Iterable');

    assert.equal(new Collection(function () {
        var index = 0;
        return new mx.Iterator(function () {
            if (index++ < 100) {
                return {
                    value: index,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }).count(), 100, 'create collection from Generator');
});


qtest('collection copyTo', function (assert) {
    var col = new Collection([1, 2, 3, 4, 5]);
    var arr1 = [0, 0, 0, 0, 0];
    var arr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var arr3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var arr4 = [];

    col.copyTo(arr1, 0);
    assert.deepEqual(arr1, [1, 2, 3, 4, 5], 'fixed size copy');

    col.copyTo(arr2, 0);
    assert.deepEqual(arr2, [1, 2, 3, 4, 5, 0, 0, 0, 0, 0], 'destination is bigger copy');

    col.copyTo(arr3, 5);
    assert.deepEqual(arr3, [0, 0, 0, 0, 0, 1, 2, 3, 4, 5], 'destination is bigger copy from middle');

    new Collection().copyTo(arr4, 0);
    assert.deepEqual(arr4, [], 'empty collection copy to');

    assert.throws(function () {
        col.copyTo(null, 0);
    }, 'null array input');

    assert.throws(function () {
        col.copyTo({}, 0);
    }, 'invalid array input');

    assert.throws(function () {
        col.copyTo(arr1, -1);
    }, 'invalid index');

    assert.throws(function () {
        col.copyTo(arr1, 6);
    }, 'invalid index');

    assert.throws(function () {
        col.copyTo(arr4, 0);
    }, 'destination is smaller');

    assert.throws(function () {
        col.copyTo(arr2, 8);
    }, 'destination does not have enough room');
});


qtest('collection toString', function (assert) {
    var col = new Collection();
    assert.equal(col.toString(), '[Collection]', 'Collection toString');
});
