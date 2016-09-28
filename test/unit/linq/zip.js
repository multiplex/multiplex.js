import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-zip');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
