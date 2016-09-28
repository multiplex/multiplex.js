import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linq-intersect');

qtest('dummy', function (assert) {
    assert.ok(mx([]), 'dumy');
});
