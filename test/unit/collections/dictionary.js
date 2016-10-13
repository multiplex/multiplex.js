import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('dictionary');

var Dictionary = mx.Dictionary;

qtest('create dictionary', function (assert) {
    assert.ok(new Dictionary() !== null, 'empty dictionary');
});


qtest('dictionary toString', function (assert) {
    assert.equal(new Dictionary().toString(), '[Dictionary]', 'Dictionary toString');
});