import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-to-list');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
