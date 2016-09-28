import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-concat');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
