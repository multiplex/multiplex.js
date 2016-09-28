import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-average');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
