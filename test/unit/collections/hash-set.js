import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('hash-set');

var HashSet = mx.HashSet;

qtest('create hash-set', function (assert) {
    assert.ok(HashSet !== null, 'empty hash-set');
});