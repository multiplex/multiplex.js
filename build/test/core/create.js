(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

// jshint unused:false

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

    assert.equal(it.toString(), '[Iterable]', 'iterable function Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Iterable]', 'iterable function Iterable toStringTag');
});


qtest('from generator function', function (assert) {
    let it = mx(function* () {
        yield 1;
    });
    assert.equal(count(it), 1, 'generator function count');
    assert.deepEqual(toArray(it), [1], 'generator function to array');

    assert.equal(it.toString(), '[Iterable]', 'generator function Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Iterable]', 'generator function Iterable toStringTag');
});


qtest('from array', function (assert) {
    let it = mx([1]);
    assert.equal(count(it), 1, 'array iterable count');
    assert.deepEqual(toArray(it), [1], 'array iterable to array');

    assert.equal(it.toString(), '[Array Iterable]', 'generator function Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Array Iterable]', 'generator function Iterable toStringTag');
});


qtest('from string', function (assert) {
    let it = mx('s');
    assert.equal(count(it), 1, 'string iterable count');
    assert.deepEqual(toArray(it), ['s'], 'string iterable to array');

    assert.equal(it.toString(), '[Array Iterable]', 'String Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Array Iterable]', 'String Iterable toStringTag');
});


qtest('from map', function (assert) {
    let val = [[{}, 1]];
    let it = mx(new Map(val));
    assert.equal(count(it), 1, 'map iterable count');
    assert.deepEqual(toArray(it), val, 'map iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'Map Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Iterable]', 'Map Iterable toStringTag');
});


qtest('from set', function (assert) {
    let val = [{}];
    let it = mx(new Set(val));
    assert.equal(count(it), 1, 'set iterable count');
    assert.deepEqual(toArray(it), val, 'set iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'Set Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Iterable]', 'Set Iterable toStringTag');
});


qtest('from arguments', function (assert) {
    let it = mx(arguments);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [assert], 'arguments iterable to array');

    assert.equal(it.toString(), '[Array Iterable]', 'arguments Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Array Iterable]', 'arguments Iterable toStringTag');
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

    assert.equal(it.toString(), '[Array Iterable]', 'array-like Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Array Iterable]', 'array-like Iterable toStringTag');

    assert.equal(it[Symbol.iterator]().toString(), '[Array Iterator]', 'array-like Iterator toString');
    assert.equal(Object.prototype.toString.apply(it[Symbol.iterator]()), '[object Array Iterator]', 'array-like Iterator toString');

    let arr = mx(new Int8Array([1]));
    assert.equal(count(arr), 1, 'Int8Array iterable count');
    assert.deepEqual(toArray(arr), [1], 'Int8Array iterable to array');
});


qtest('from iterable object', function (assert) {
    let val = {
        items: [1],
        [Symbol.iterator]() {
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

    assert.equal(it.toString(), '[Iterable]', 'Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Iterable]', 'Iterable toStringTag');
});


qtest('from object', function (assert) {
    let it = mx({ val: 1 });
    assert.equal(count(it), 1, 'object iterable count');
    assert.deepEqual(toArray(it), [['val', 1]], 'object iterable to array');

    assert.equal(it.toString(), '[Object Iterable]', 'object Iterable toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Object Iterable]', 'object Iterable toStringTag');

    assert.equal(it[Symbol.iterator]().toString(), '[Object Iterator]', 'object Iterator toStringTag');
    assert.equal(Object.prototype.toString.apply(it[Symbol.iterator]()), '[object Object Iterator]', 'object Iterator toStringTag');
});


qtest('from non-object value', function (assert) {
    let it = mx(1);
    assert.equal(count(it), 1, 'non-object iterable count');
    assert.deepEqual(toArray(it), [1], 'non-object iterable to array');

    assert.equal(it.toString(), '[Array Iterable]', 'non-object Iterator toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Array Iterable]', 'non-object Iterable, toStringTag');
});


qtest('from null value', function (assert) {
    let it = mx(null);
    assert.equal(count(it), 0, 'empty(null) iterable count');
    assert.deepEqual(toArray(it), [], 'empty(null) iterable to array');

    assert.equal(it.toString(), '[Empty Iterable]', 'empty(null) Iterator toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Empty Iterable]', 'empty(null) Iterable, toStringTag');

    assert.equal(it[Symbol.iterator]().toString(), '[Empty Iterator]', 'empty(undefined) Iterator toString');
    assert.equal(Object.prototype.toString.apply(it[Symbol.iterator]()), '[object Empty Iterator]', 'empty(undefined) Iterator toStringTag');
});


qtest('from undefined value', function (assert) {
    let it = mx();
    assert.equal(count(it), 0, 'empty(undefined) iterable count');
    assert.deepEqual(toArray(it), [], 'empty(undefined) iterable to array');

    assert.equal(it.toString(), '[Empty Iterable]', 'empty(undefined) Iterator toString');
    assert.equal(Object.prototype.toString.apply(it), '[object Empty Iterable]', 'empty(undefined) Iterable, toStringTag');

    assert.equal(it[Symbol.iterator]().toString(), '[Empty Iterator]', 'empty(undefined) Iterator toString');
    assert.equal(Object.prototype.toString.apply(it[Symbol.iterator]()), '[object Empty Iterator]', 'empty(undefined) Iterator toStringTag');
});

})));

