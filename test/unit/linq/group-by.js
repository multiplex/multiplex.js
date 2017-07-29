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
    var grp = mx(mocks.array).groupBy(identity, identity);
    var grp1 = grp.first();

    assert.equal(grp.count(), mocks.array.length, 'Test groupBy numbers in an array are less than 10');

    assert.equal(grp1.count(), 1, 'Test grouping count');
    assert.equal(grp1.toArray().length, 1, 'Test grouping toArray');
    assert.equal(grp1.toString(), '[Grouping]', 'Test grouping toString');
});