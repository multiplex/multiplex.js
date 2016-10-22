import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('stack');

var Stack = mx.Stack;

qtest('create stack', function (assert) {
    assert.ok(new Stack() !== null, 'empty stack');
    assert.ok(new Stack([1, 2, 3]) !== null, 'simple numeric stack');
});


qtest('stack toString', function (assert) {
    assert.equal(new Stack().toString(), '[Stack]', 'Stack toString');
});