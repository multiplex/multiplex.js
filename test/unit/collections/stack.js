import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('stack');

var Stack = mx.Stack;

qtest('create stack', function (assert) {
    assert.ok(new Stack() !== null, 'empty stack');
});
