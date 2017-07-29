import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('lookup');

var Lookup = mx.Lookup;

function identity(t) {
    return t;
}

qtest('create lookup', function (assert) {
    assert.ok(new Lookup([1, 2, 3, 4, 5], identity) !== null, 'simple numeric Lookup');
});


qtest('map toString', function (assert) {
    assert.equal(new Lookup([], identity).toString(), '[Lookup]', 'Lookup toString');
});