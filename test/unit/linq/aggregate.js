import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-aggregate');

qtest('basic aggregate over numbers', function (assert) {
    assert.equal(mx(mocks.array).aggregate(10, function (a, b) {
        return a + b;
    }), 25, 'Aggregate 5 numbers with seed!');

    assert.equal(mx(mocks.array).aggregate(10, function (a, b) {
        return a + b;
    }, function (t) {
        return t * 2;
    }), 50, 'Aggregate 5 numbers with seed and result selector!');
});