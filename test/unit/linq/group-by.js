import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-group-by');

function identity(t) {
    return t;
}

qtest('basic group-by test', function (assert) {
    assert.equal(mx(mocks.array).groupBy(identity, identity).count(), mocks.array.length, 'Test groupBy numbers in an array are less than 10');
});