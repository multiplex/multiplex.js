import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('list');

var List = mx.List;

qtest('create list', function (assert) {
    assert.ok(new List() !== null, 'empty list');
    assert.ok(new List([1, 2, 3]) !== null, 'simple numeric list');
});


qtest('list toString', function (assert) {
    assert.equal(new List().toString(), '[List]', 'List toString');
});