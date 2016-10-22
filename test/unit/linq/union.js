import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-union');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
