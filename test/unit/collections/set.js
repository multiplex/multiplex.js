import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('set');

var Set = mx.Set;

qtest('create set', function (assert) {
    assert.ok(new Set() !== null, 'empty set');
});
