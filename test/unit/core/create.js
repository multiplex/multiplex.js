import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('create');


function count(val) {
    var iterator = val[mx.iteratorSymbol](),
        count = 0;

    while (!iterator.next().done) {
        count++;
    }

    return count;
}

function toArray(val) {
    var iterator = val[mx.iteratorSymbol](),
        arr = [],
        result;

    while (!(result = iterator.next()).done) {
        arr.push(result.value);
    }

    return arr;
}


qtest('from iterable function', function (assert) {
    var it = mx(function () {
        var index = 0;
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

    assert.throws(function () {
        new mx.Iterator(1);
    }, 'Iterator throws exception when passed anything beside a "next" function factory');
});


qtest('from generator function', function (assert) {
    try {
        var it = mx(eval('(function*() { yield 1; })'));
        assert.equal(count(it), 1, 'generator function count');
        assert.deepEqual(toArray(it), [1], 'generator function to array');
    }
    catch (e) {
        assert.equal(1, 1, 'dummy test to bypass generator function in non-supprted environments');
    }
});


qtest('from array', function (assert) {
    var it = mx([1]);
    assert.equal(count(it), 1, 'array iterable count');
    assert.deepEqual(toArray(it), [1], 'array iterable to array');
});


qtest('from string', function (assert) {
    var it = mx('s');
    assert.equal(count(it), 1, 'string iterable count');
    assert.deepEqual(toArray(it), ['s'], 'string iterable to array');
});


qtest('from map', function (assert) {
    if (typeof Map === 'object') {
        var val = [[{}, 1]];
        var it = mx(new Map(val));
        assert.equal(count(it), 1, 'map iterable count');
        assert.deepEqual(toArray(it), val, 'map iterable to array');
    }
    else {
        assert.equal(1, 1, 'dummy test to bypass map in non-supprted environments');
    }
});


qtest('from set', function (assert) {
    if (typeof Set === 'object') {
        var val = [{}];
        var it = mx(new Set(val));
        assert.equal(count(it), 1, 'set iterable count');
        assert.deepEqual(toArray(it), val, 'set iterable to array');
    }
    else {
        assert.equal(1, 1, 'dummy test to bypass set in non-supprted environments');
    }
});


qtest('from arguments', function (assert) {
    var it = mx(arguments);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [assert], 'arguments iterable to array');
});


qtest('from array-like object', function (assert) {
    var val = {
        length: 1,
        splice: Array.prototype.splice
    };
    val[0] = 1;

    var it = mx(val);
    assert.equal(count(it), 1, 'array-like iterable count');
    assert.deepEqual(toArray(it), [1], 'array-like iterable to array');

    if (typeof Int8Array === 'object') {
        var arr = new Int8Array([1]);
        assert.equal(count(arr), 1, 'Int8Array iterable count');
        assert.deepEqual(toArray(arr), [1], 'Int8Array iterable to array');
    }
});


qtest('from iterable object', function (assert) {
    var val = {
        items: [1]
    };

    val[mx.iteratorSymbol] = function () {
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

    var it = mx(val);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [1], 'arguments iterable to array');
});


qtest('from object', function (assert) {
    var it = mx({ val: 1 });
    assert.equal(count(it), 1, 'object iterable count');
    assert.deepEqual(toArray(it), [['val', 1]], 'object iterable to array');
});


qtest('from non-object value', function (assert) {
    var it = mx(1);
    assert.equal(count(it), 1, 'non-object iterable count');
    assert.deepEqual(toArray(it), [1], 'non-object iterable to array');
});
