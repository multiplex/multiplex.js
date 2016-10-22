import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-for-each');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
