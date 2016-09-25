import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('list');

var List = mx.List;

qtest('create list', function (assert) {
    assert.ok(new List() !== null, 'empty list');
});
