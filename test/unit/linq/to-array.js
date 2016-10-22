import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-to-array');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
