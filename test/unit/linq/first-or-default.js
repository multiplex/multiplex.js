import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-first-or-default');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
