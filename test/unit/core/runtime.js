import mx from '../../multiplex'
import {module, test} from '../../qunit'

module('runtime');

test('dummy', function (assert) {
    assert.ok(mx === mx, 'Dummy test!');
});
