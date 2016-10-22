import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('map');

var Map = mx.Map;

qtest('create map', function (assert) {
    assert.ok(new Map() !== null, 'empty map');
    assert.ok(new Map([[1, 1], [2, 2], [3, 3]]) !== null, 'simple numeric Map');
});


qtest('map toString', function (assert) {
    assert.equal(new Map().toString(), '[Map]', 'Map toString');
});