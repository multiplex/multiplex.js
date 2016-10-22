import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-group-join');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
