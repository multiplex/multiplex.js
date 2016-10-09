import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('hash-set');

var HashSet = mx.HashSet;

qtest('create hash-set', function (assert) {
    assert.ok(new HashSet() !== null, 'empty hash-set');
    assert.ok(new HashSet([1, 2, 3]) !== null, 'simple numeric HashSet');
});
