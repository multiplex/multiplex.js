(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, function (mx) { 'use strict';

    mx = 'default' in mx ? mx['default'] : mx;

    var qmodule = QUnit.module;
    var qtest = QUnit.test;

    qmodule('create');


    function count(val) {
        let count = 0;
        for (let i of val) {
            count++;
        }

        return count;
    }

    function toArray(val) {
        let arr = [];
        for (let i of val) {
            arr.push(i);
        }

        return arr;
    }


    qtest('from iterable function', function (assert) {
        let it = mx(function () {
            let index = 0;
            return new mx.Iterator(function () {
                if (index++ < 1) {
                    return {
                        value: index,
                        done: false
                    };
                }

                return {
                    done: true
                };
            });
        });
        assert.equal(count(it), 1, 'iterable function count');
        assert.deepEqual(toArray(it), [1], 'iterable function to array');
    });


    qtest('from generator function', function (assert) {
        let it = mx(function* () {
            yield 1;
        });
        assert.equal(count(it), 1, 'generator function count');
        assert.deepEqual(toArray(it), [1], 'generator function to array');
    });


    qtest('from array', function (assert) {
        let it = mx([1]);
        assert.equal(count(it), 1, 'array iterable count');
        assert.deepEqual(toArray(it), [1], 'array iterable to array');
    });


    qtest('from string', function (assert) {
        let it = mx('s');
        assert.equal(count(it), 1, 'string iterable count');
        assert.deepEqual(toArray(it), ['s'], 'string iterable to array');
    });


    qtest('from map', function (assert) {
        let val = [[{}, 1]];
        let it = mx(new Map(val));
        assert.equal(count(it), 1, 'map iterable count');
        assert.deepEqual(toArray(it), val, 'map iterable to array');
    });


    qtest('from set', function (assert) {
        let val = [{}];
        let it = mx(new Set(val));
        assert.equal(count(it), 1, 'set iterable count');
        assert.deepEqual(toArray(it), val, 'set iterable to array');
    });


    qtest('from arguments', function (assert) {
        let it = mx(arguments);
        assert.equal(count(it), 1, 'arguments iterable count');
        assert.deepEqual(toArray(it), [assert], 'arguments iterable to array');
    });


    qtest('from array-like object', function (assert) {
        let val = {
            length: 1,
            splice: Array.prototype.splice,
            [0]: 1
        };

        let it = mx(val);
        assert.equal(count(it), 1, 'Array-like iterable count');
        assert.deepEqual(toArray(it), [1], 'Array-like iterable to array');

        let arr = mx(new Int8Array([1]));
        assert.equal(count(arr), 1, 'Int8Array iterable count');
        assert.deepEqual(toArray(arr), [1], 'Int8Array iterable to array');
    });


    qtest('from iterable object', function (assert) {
        let val = {
            items: [1],
            [mx.iteratorSymbol]() {
                let index = 0;
                return {
                    next() {
                        if (index < 1) {
                            return {
                                value: val.items[index++],
                                done: false
                            };
                        }

                        return {
                            done: true
                        };
                    }
                };
            }
        };


        let it = mx(val);
        assert.equal(count(it), 1, 'iterable object count');
        assert.deepEqual(toArray(it), [1], 'iterable object to array');
    });


    qtest('from object', function (assert) {
        let it = mx({ val: 1 });
        assert.equal(count(it), 1, 'object iterable count');
        assert.deepEqual(toArray(it), [['val', 1]], 'object iterable to array');
    });


    qtest('from non-object value', function (assert) {
        let it = mx(1);
        assert.equal(count(it), 1, 'non-object iterable count');
        assert.deepEqual(toArray(it), [1], 'non-object iterable to array');
    });

}));

