import mx from '../../multiplex';
import {
    qmodule,
    qtest
} from '../../qunit';

qmodule('list');

var List = mx.List;

function positiveMatch(t) {
    return t > 0;
}

qtest('create list', function (assert) {
    var list = new List(1, 2, 3);
    assert.ok(new List() !== null, 'empty list');
    assert.ok(list.count() === 3, 'simple numeric list');
    list.findIndex(0, positiveMatch);
    list.findLastIndex(0, positiveMatch);
    list.binarySearch(1);
    list.insert(0, 0);
    list.remove(0);
    list.sort();
    list.removeAll(positiveMatch);
    list.trueForAll(positiveMatch);
    list.clear();
});


qtest('list toString', function (assert) {
    assert.equal(new List().toString(), '[List]', 'List toString');
});