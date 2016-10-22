import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-max');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
