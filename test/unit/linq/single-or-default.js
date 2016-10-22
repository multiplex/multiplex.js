import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-single-or-default');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
