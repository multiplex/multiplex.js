import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-default-if-empty');

qtest('basic "defaultIfEmpty" test', function (assert) {
    assert.equal(mx(mocks.array).defaultIfEmpty().count(), 5, 'defaultIfEmpty on a non-empty array');
    assert.equal(mx([]).defaultIfEmpty(1).toArray()[0], 1, 'defaultIfEmpty on an empty array');
});