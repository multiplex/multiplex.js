import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('equalityComparer');

var EqualityComparer = mx.EqualityComparer;


function numericHashFunction(obj) {
    return obj >> 32;
}

function numericEqualsFunction(objA, objB) {
    return objA === objB;
}

qtest('create equalityComparer', function (assert) {
    assert.ok(new EqualityComparer(numericHashFunction, numericEqualsFunction) !== null, 'simple numeric equalityComparer');
    assert.ok(EqualityComparer.instance instanceof EqualityComparer, 'default equalityComparer');
});


qtest('basic equalityComparer tests', function (assert) {
    var com = new EqualityComparer(numericHashFunction, numericEqualsFunction);
    assert.equal(com.hash(1), 1, 'simple numeric hash');
    assert.equal(com.hash(Math.pow(2, 32) + 1), 1, 'simple numeric max number hash');
    assert.equal(com.equals(1, 1), true, 'simple numeric equals');
    assert.equal(com.equals(1, 0), false, 'simple numeric non-equals different hash');
    assert.equal(com.equals(1, Math.pow(2, 32) + 1), false, 'simple numeric non-equals same hash');
});


qtest('equalityComparer toString', function (assert) {
    assert.equal(EqualityComparer.instance.toString(), '[EqualityComparer]', 'EqualityComparer toString');
});
