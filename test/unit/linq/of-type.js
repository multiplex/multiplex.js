import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-of-type');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
