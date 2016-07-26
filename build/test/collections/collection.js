(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, function (mx) { 'use strict';

    mx = 'default' in mx ? mx['default'] : mx;

    var qmodule = QUnit.module;
    var qtest = QUnit.test;

    qmodule('collection');

    var Collection = mx.Collection;

    qtest('create collection', function (assert) {
        assert.equal(new Collection().length, 0, 'empty collection');
        assert.equal(new Collection([1, 2, 3]).length, 3, 'create collection from array');
        assert.equal(new Collection('string').length, 6, 'create collection from string');
        assert.equal(new Collection(arguments).length, 1, 'create collection from arguments');
        assert.equal(new Collection(new Collection([1])).length, 1, 'create collection from another collection');
        assert.equal(new Collection(mx([1, 2, 3])).length, 3, 'create collection from ArrayIterable');
        assert.equal(new Collection(mx({ val: 1 })).length, 1, 'create collection from ObjectIterable');
        assert.equal(new Collection(mx([1, 2, 3]).select(t => t * 2)).length, 3, 'create collection from Iterable');
    });


    qtest('toArray', function (assert) {
        assert.deepEqual(new Collection().toArray(), [], 'empty collection tpArray');
        assert.deepEqual(new Collection([1, 2, 3]).toArray(), [1, 2, 3], 'create collection from array then toarray');
        assert.deepEqual(new Collection('string').toArray(), ['s', 't', 'r', 'i', 'n', 'g'], 'create collection from string and toarray');
        assert.deepEqual(new Collection(arguments).toArray(), [assert], 'create collection from arguments and toArray');
        assert.deepEqual(new Collection(new Collection([1])).toArray(), [1], 'create collection from another collection and toArray');
        assert.deepEqual(new Collection(mx([1, 2, 3])).toArray(), [1, 2, 3], 'create collection from ArrayIterable and toArray');
        assert.deepEqual(new Collection(mx({ val: 1 })).toArray(), [['val', 1]], 'create collection from ObjectIterable and toArray');
        assert.deepEqual(new Collection(mx([1, 2, 3]).select(t => t * 2)).toArray(), [2, 4, 6], 'create collection from Iterable and toArray');
    });


    qtest('methods', function (assert) {
        var col = new Collection();
        assert.ok(col.toString(), '[Collection]');
    });

}));

