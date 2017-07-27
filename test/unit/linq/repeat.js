import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('linq-repeat');

qtest('basic "repeat" tests', function (assert) {
    assert.equal(mx.repeat(1, 5).count(), 5, 'Test repeat a number 5 times');
    assert.equal(mx.range(1, 0).count(), 0, 'Test repeat a number zero times');
    assert.deepEqual(mx.repeat(1, 5).toArray(), [1, 1, 1, 1, 1], 'Test repeat value 5 times');
});


qtest('repeat method validations', function (assert) {
    assert.throws(function () {
        mx.repeat();
    }, 'undefined count');

    assert.throws(function () {
        mx.range(5, true);
    }, 'non-number count');

    assert.throws(function () {
        mx.range(0, -5);
    }, 'negative count');
});