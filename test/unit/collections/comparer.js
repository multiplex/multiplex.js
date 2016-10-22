import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('comparer');

var Comparer = mx.Comparer;


function numericComparerFunction(objA, objB) {
    if (objA > objB) {
        return 1;
    }

    if (objB > objA) {
        return -1;
    }

    return 0;
}

qtest('create comparer', function (assert) {
    assert.ok(new Comparer(numericComparerFunction) !== null, 'simple numeric comparer');
    assert.ok(Comparer.instance instanceof Comparer, 'default comparer');
});


qtest('basic comparer tests', function (assert) {
    var com = new Comparer(numericComparerFunction);
    assert.equal(com.compare(1, 1), 0, 'simple numeric equality compare');
    assert.equal(com.compare(1, 0), 1, 'simple numeric greater-than compare');
    assert.equal(com.compare(0, 1), -1, 'simple numeric less-than compare');
});

qtest('comparer factory method', function (assert) {
    var com = new Comparer(numericComparerFunction);
    assert.equal(Comparer.from(), Comparer.instance, 'create from undefined value');
    assert.equal(Comparer.from(null), Comparer.instance, 'create from null value');
    assert.equal(Comparer.from(1), Comparer.instance, 'create from invalid value');
    assert.equal(Comparer.from(com), com, 'create from Comparer instance');
    assert.equal(Comparer.from(numericComparerFunction).compare, numericComparerFunction, 'create from factory function');
    assert.equal(Comparer.from({
        compare: numericComparerFunction
    }).compare, numericComparerFunction, 'create from object literal');
});


qtest('comparer validations', function (assert) {
    assert.throws(function () {
        return new Comparer();
    }, 'null/undefined comparison');

    assert.throws(function () {
        return new Comparer(1);
    }, 'non-function comparison');
});

qtest('comparer toString', function (assert) {
    assert.equal(new Comparer(numericComparerFunction).toString(), '[Comparer]', 'Comparer toString');
});
