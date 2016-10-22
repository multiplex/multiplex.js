import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-select-many');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
