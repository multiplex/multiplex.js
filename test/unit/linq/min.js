import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-min');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
