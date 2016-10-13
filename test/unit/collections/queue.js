import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('queue');

var Queue = mx.Queue;

qtest('create queue', function (assert) {
    assert.ok(new Queue() !== null, 'empty queue');
    assert.ok(new Queue([1, 2, 3]) !== null, 'simple numeric queue');
});


qtest('queue toString', function (assert) {
    assert.equal(new Queue().toString(), '[Queue]', 'Queue toString');
});