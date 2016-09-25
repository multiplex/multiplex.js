import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('map');

var Map = mx.Map;

qtest('create map', function (assert) {
    assert.ok(new Map() !== null, 'empty map');
});
