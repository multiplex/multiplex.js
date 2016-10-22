import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-take-while');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
