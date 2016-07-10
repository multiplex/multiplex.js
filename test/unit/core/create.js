import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('create');


function count(val) {
    var count = 0;
    for (var i of val) {
        count++;
    }

    return count;
}

function toArray(val) {
    var arr = [];
    for (var i of val) {
        arr.push(i);
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
    }, 'Iterator throws exception when passed anything beside a "next" function factory')
});


qtest('from generator function', function (assert) {
    var it = mx(function* () {
        yield 1;
    });
    assert.equal(count(it), 1, 'generator function count');
    assert.deepEqual(toArray(it), [1], 'generator function to array');
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
    var val = [[{}, 1]];
    var it = mx(new Map(val));
    assert.equal(count(it), 1, 'map iterable count');
    assert.deepEqual(toArray(it), val, 'map iterable to array');
});


qtest('from set', function (assert) {
    var val = [{}];
    var it = mx(new Set(val));
    assert.equal(count(it), 1, 'set iterable count');
    assert.deepEqual(toArray(it), val, 'set iterable to array');
});


qtest('from arguments', function (assert) {
    var it = mx(arguments);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [assert], 'arguments iterable to array');
});


qtest('from array-like object', function (assert) {
    var val = {
        length: 1,
        splice: Array.prototype.splice,
        [0]: 1
    };

    var it = mx(val);
    assert.equal(count(it), 1, 'arguments iterable count');
    assert.deepEqual(toArray(it), [1], 'arguments iterable to array');
});


qtest('from iterable object', function (assert) {
    var val = {
        items: [1],
        [mx.iteratorSymbol]() {
            var index = 0;
            return {
                next() {
                    if (index < 1) {
                        return {
                            value: val.items[index++],
                            done: false
                        }
                    }

                    return {
                        done: true
                    };
                }
            }
        }
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
