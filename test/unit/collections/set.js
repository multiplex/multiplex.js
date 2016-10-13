import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('set');

var Set = mx.Set;

qtest('create set', function (assert) {
    assert.ok(new Set() !== null, 'empty set');
    assert.ok(new Set([1, 2, 3]) !== null, 'simple numeric Set');
});


qtest('set toString', function (assert) {
    assert.equal(new Set().toString(), '[Set]', 'Set toString');
});