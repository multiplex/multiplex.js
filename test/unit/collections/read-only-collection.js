import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('read-only-collection');

var ReadOnlyCollection = mx.ReadOnlyCollection;

qtest('create read-only-collection', function (assert) {
    assert.ok(new ReadOnlyCollection([]) !== null, 'empty read-only-collection');
    assert.ok(new ReadOnlyCollection([1, 2, 3]) !== null, 'simple numeric ReadOnlyCollection');
});


qtest('read-only-collection toString', function (assert) {
    assert.equal(new ReadOnlyCollection([]).toString(), '[ReadOnlyCollection]', 'ReadOnlyCollection toString');
});