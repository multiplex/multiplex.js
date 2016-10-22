import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-default-if-empty');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
