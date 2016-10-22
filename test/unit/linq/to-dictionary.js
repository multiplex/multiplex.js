import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-to-dictionary');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
