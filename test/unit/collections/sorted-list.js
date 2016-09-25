import mx from '../../multiplex';
import {qmodule, qtest} from '../../qunit';

qmodule('sorted-list');

var SortedList = mx.SortedList;

qtest('create sorted-list', function (assert) {
    assert.ok(new SortedList() !== null, 'empty sorted-list');
});
