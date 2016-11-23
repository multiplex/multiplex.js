import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-except');

qtest('basic "except" test', function (assert) {
    assert.ok(mx([]), 'dumy');
});
