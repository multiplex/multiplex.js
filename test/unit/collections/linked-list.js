import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('linked-list');

var LinkedList = mx.LinkedList;

qtest('create linked-list', function (assert) {
    assert.ok(new LinkedList() !== null, 'empty linked-list');
    assert.ok(new LinkedList([1, 2, 3]) !== null, 'simple numeric LinkedList');
});


qtest('linked-list toString', function (assert) {
    assert.equal(new LinkedList().toString(), '[Linked List]', 'LinkedList toString');
});