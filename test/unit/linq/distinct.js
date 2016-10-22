import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-distinct');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
