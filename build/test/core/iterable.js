(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

qmodule('create');


var Iterable = mx.Iterable;
var Iterator = mx.Iterator;


function count(val) {
    var iterator = val[mx.runtime.iteratorSymbol](),
        count = 0;

    while (!iterator.next().done) {
        count++;
    }

    return count;
}

function toArray(val) {
    var iterator = val[mx.runtime.iteratorSymbol](),
        arr = [],
        result;

    while (!(result = iterator.next()).done) {
        arr.push(result.value);
    }

    return arr;
}


qtest('from iterable function', function (assert) {
    var it = new Iterable(function () {
        var index = 0;
        return new Iterator(function () {
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
    //assert.equal(count(it), 1, 'iterable function count');
    assert.deepEqual(toArray(it), [1], 'iterable function to array');

    assert.equal(it.toString(), '[Iterable]', 'iterable function Iterable toString');
});


qtest('from generator function', function (assert) {
    /*jshint evil:true*/
    try {
        var it = new Iterable(eval('(function*() { yield 1; })'));
        assert.equal(count(it), 1, 'generator function count');
        assert.deepEqual(toArray(it), [1], 'generator function to array');

        assert.equal(it.toString(), '[Iterable]', 'generator function Iterable toString');
    }
    catch (e) {
        assert.equal(1, 1, 'dummy test to bypass generator function in non-supprted environments');
    }
});


qtest('from array', function (assert) {
    var it = new Iterable([1]);
    assert.equal(count(it), 1, 'array iterable count');
    assert.deepEqual(toArray(it), [1], 'array iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'Array Iterable toString');
});


qtest('from string', function (assert) {
    var it = new Iterable('s');
    assert.equal(count(it), 1, 'string iterable count');
    assert.deepEqual(toArray(it), ['s'], 'string iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'String Iterable toString');
});


qtest('from map', function (assert) {
    if (typeof Map === 'function') {
        var val = [[{}, 1]];
        var it = new Iterable(new Map(val));
        assert.equal(count(it), 1, 'map iterable count');
        assert.deepEqual(toArray(it), val, 'map iterable to array');

        assert.equal(it.toString(), '[Iterable]', 'Map Iterable toString');
    }
    else {
        assert.equal(1, 1, 'dummy test to bypass map in non-supprted environments');
    }
});


qtest('from set', function (assert) {
    if (typeof Set === 'function') {
        var val = [{}];
        var it = new Iterable(new Set(val));
        assert.equal(count(it), 1, 'set iterable count');
        assert.deepEqual(toArray(it), val, 'set iterable to array');

        assert.equal(it.toString(), '[Iterable]', 'Set Iterable toString');
    }
    else {
        assert.equal(1, 1, 'dummy test to bypass set in non-supprted environments');
    }
});


qtest('from arguments', function (assert) {
    var it = new Iterable(arguments);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [assert], 'arguments iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'arguments Iterable toString');
});


qtest('from array-like object', function (assert) {
    var val = {
        length: 1,
        splice: Array.prototype.splice
    };
    val[0] = 1;

    var it = new Iterable(val);
    assert.equal(count(it), 1, 'array-like iterable count');
    assert.deepEqual(toArray(it), [1], 'array-like iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'array-like Iterable toString');
    assert.equal(it[mx.runtime.iteratorSymbol]().toString(), '[Array Iterator]', 'array-like Iterator toString');

    if (typeof Int8Array === 'function') {
        var arr = new Iterable(new Int8Array([1]));
        assert.equal(count(arr), 1, 'Int8Array iterable count');
        assert.deepEqual(toArray(arr), [1], 'Int8Array iterable to array');
    }
});


qtest('from iterable object', function (assert) {
    var val = {
        items: [1]
    };

    val[mx.runtime.iteratorSymbol] = function () {
        var index = 0;
        return {
            next: function () {
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
    };

    var it = new Iterable(val);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [1], 'arguments iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'Iterable toString');
});


qtest('from object', function (assert) {
    var it = new Iterable({ val: 1 });
    assert.equal(count(it), 1, 'object iterable count');
    assert.deepEqual(toArray(it), [['val', 1]], 'object iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'object Iterable toString');
    assert.equal(it[mx.runtime.iteratorSymbol]().toString(), '[Object Iterator]', 'object Iterator toString');
});


qtest('from non-object value', function (assert) {
    var it = new Iterable(1);
    assert.equal(count(it), 1, 'non-object iterable count');
    assert.deepEqual(toArray(it), [1], 'non-object iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'non-object Iterable toString');
});


qtest('from null value', function (assert) {
    var it = new Iterable(null);
    assert.equal(count(it), 0, 'empty(null) iterable count');
    assert.deepEqual(toArray(it), [], 'empty(null) iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'empty(null) Iterator toString');
    assert.equal(it[mx.runtime.iteratorSymbol]().toString(), '[Empty Iterator]', 'empty(null) Iterator toString');
});


qtest('from undefined value', function (assert) {
    var it = new Iterable();
    assert.equal(count(it), 0, 'empty(undefined) iterable count');
    assert.deepEqual(toArray(it), [], 'empty(undefined) iterable to array');

    assert.equal(it.toString(), '[Iterable]', 'empty(undefined) Iterator toString');
    assert.equal(it[mx.runtime.iteratorSymbol]().toString(), '[Empty Iterator]', 'empty(undefined) Iterator toString');
});


qtest('from empty factory method', function (assert) {
    var it = Iterable.empty();
    assert.equal(count(it), 0, 'empty iterable count');
    assert.deepEqual(toArray(it), [], 'empty iterable to array');

    assert.equal(it.toString(), '[Empty Iterable]', 'empty Iterator toString');
    assert.equal(it[mx.runtime.iteratorSymbol]().toString(), '[Empty Iterator]', 'empty Iterator toString');
});

})));

