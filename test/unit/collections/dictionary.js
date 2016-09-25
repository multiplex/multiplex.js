import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('dictionary');

var Dictionary = mx.Dictionary;

qtest('create dictionary', function (assert) {
    assert.ok(new Dictionary() !== null, 'empty dictionary');
});
