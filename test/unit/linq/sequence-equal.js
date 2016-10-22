import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-sequence-equal');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
