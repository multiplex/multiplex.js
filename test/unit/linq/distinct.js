import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-distinct');

qtest('basic "distinct" test', function (assert) {
    assert.ok(mx([]), 'dumy');
});
