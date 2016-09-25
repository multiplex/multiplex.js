import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('queue');

var Queue = mx.Queue;

qtest('create queue', function (assert) {
    assert.ok(new Queue() !== null, 'empty queue');
});
