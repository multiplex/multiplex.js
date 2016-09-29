import mx from '../../multiplex';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-zip');

qtest('homogeneous zip', function (assert) {
    assert.deepEqual(mx([1, 2]).zip([3, 4], function (t, u) {
        return t + u;
    }).toArray(), [4, 6], 'Zip two numeric array!');
});


qtest('heterogeneous zip', function (assert) {
    assert.deepEqual(mx([1, 2]).zip([3], function (t, u) {
        return t + u;
    }).toArray(), [4], 'Zip two numeric array!');

    assert.deepEqual(mx([]).zip([3], function (t, u) {
        return t + u;
    }).toArray(), [], 'Zip an empty iterable with anything results in an empty iterable!');

    assert.deepEqual(mx([1, 2]).zip([], function (t, u) {
        return t + u;
    }).toArray(), [], 'Zip anything with an empty iterable results in an empty iterable!');
});


qtest('zip method validations', function (assert) {
    assert.throws(function () {
        mx([1]).zip();
    }, 'null input');

    assert.throws(function () {
        mx([1]).zip([2]);
    }, 'null result selector');

    assert.throws(function () {
        mx([1]).zip([2], 1);
    }, 'non-function result selector');
});