import mx from '../../multiplex';
import * as mocks from './_mocks';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('linq-average');


function simpleNumericSelector(t) {
    return t * 2;
}

qtest('basic average test', function (assert) {
    assert.equal(mx(mocks.array).average(), 3, 'Test average of first 5 numbers');
});