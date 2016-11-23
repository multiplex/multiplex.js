import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-first');

qtest('basic "first" test', function (assert) {
    assert.ok(mx([]), 'dumy');
});
