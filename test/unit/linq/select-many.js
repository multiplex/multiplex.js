import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-select-many');

function identity(t) {
    return t;
}

qtest('basic select-many test', function (assert) {
    assert.equal(mx([mocks.array]).selectMany(identity, identity).count(), mocks.array.length, 'Test selectMany numbers in an array are less than 10');
});