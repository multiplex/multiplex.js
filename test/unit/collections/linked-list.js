import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('linked-list');

var LinkedList = mx.LinkedList;

qtest('create linked-list', function (assert) {
    assert.ok(new LinkedList() !== null, 'empty linked-list');
});
