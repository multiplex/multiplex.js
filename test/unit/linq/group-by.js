import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-group-by');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
