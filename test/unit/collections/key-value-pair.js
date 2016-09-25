import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('key-value-pair');

var KeyValuePair = mx.KeyValuePair;

qtest('create key-value-pair', function (assert) {
    assert.ok(new KeyValuePair('key', 'value') !== null, 'empty key-value-pair');
});
