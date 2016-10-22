import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-reverse');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
