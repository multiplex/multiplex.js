import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-group-join');

function identity(t) {
    return t;
}

qtest('basic group-join test', function (assert) {
    assert.equal(mx(mocks.array).groupJoin(mocks.array, identity, identity, identity).count(), mocks.array.length, 'Test groupJoin numbers in an array are less than 10');
});