import mx from '../../multiplex'
import {qmodule, qtest} from '../../qunit'

qmodule('runtime');

qtest('dummy', function (assert) {
    assert.ok(mx === mx, 'Dummy test!');
});
