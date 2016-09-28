import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-last-or-default');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
