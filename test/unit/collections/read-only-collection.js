import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('read-only-collection');

var ReadOnlyCollection = mx.ReadOnlyCollection;

qtest('create read-only-collection', function (assert) {
    assert.ok(new ReadOnlyCollection([]) !== null, 'empty read-only-collection');

    var list = new ReadOnlyCollection([1, 2, 3]);
    assert.ok(list.count() === 3, 'simple numeric ReadOnlyCollection');

    list.get(1);
    list.indexOf(1);

    assert.throws(function () {
        list = new ReadOnlyCollection(1);
    }, 'invalid input');
});


qtest('read-only-collection toString', function (assert) {
    assert.equal(new ReadOnlyCollection([]).toString(), '[ReadOnlyCollection]', 'ReadOnlyCollection toString');
});
