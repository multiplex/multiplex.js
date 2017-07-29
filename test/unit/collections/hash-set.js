import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('hash-set');

var HashSet = mx.HashSet;

function factory() {
    return new HashSet([1, 2, 3, 4, 5]);
}


qtest('create hash-set', function (assert) {
    assert.ok(new HashSet() !== null, 'empty hash-set');
    assert.ok(factory() !== null, 'simple numeric HashSet');
});

qtest('hash-set "add" tests', function (assert) {
    var set = factory();

    assert.ok(set.add(0), 'HashSet add new item');
    assert.ok(!set.add(1), 'HashSet add exisiting item');
});

qtest('hash-set "clear" tests', function (assert) {
    var set = factory();

    assert.equal(set.count(), 5, 'HashSet count before clear');
    set.clear();
    assert.equal(set.count(), 0, 'HashSet count after clear');
});

qtest('hash-set "count" tests', function (assert) {
    var set = factory();

    assert.equal(set.count(), 5, 'HashSet count');
    assert.equal(set.count(function (t) {
        return t % 2 === 0;
    }), 2, 'HashSet count with predicate');
});

qtest('hash-set "contains" tests', function (assert) {
    var set = factory();

    assert.ok(set.contains(1), 'HashSet contains');
    assert.ok(!set.contains(0), 'HashSet not contains');
});

qtest('hash-set "exceptWith" tests', function (assert) {
    var set = factory();
    set.exceptWith([]);
    assert.equal(set.count(), 5, 'HashSet exceptWith empty');

    var set = factory();
    set.exceptWith(set);
    assert.equal(set.count(), 0, 'HashSet exceptWith itself');

    var set = factory();
    set.exceptWith([1, 2, 3]);
    assert.equal(set.count(), 2, 'HashSet exceptWith some iterable');
});

qtest('hash-set "intersectWith" tests', function (assert) {
    var set = factory();
    set.intersectWith([]);
    assert.equal(set.count(), 0, 'HashSet intersectWith empty');

    var set = factory();
    set.intersectWith(set);
    assert.equal(set.count(), 5, 'HashSet intersectWith itself');

    var set = factory();
    set.intersectWith(new HashSet([1, 2, 3]));
    assert.equal(set.count(), 3, 'HashSet intersectWith some HashSet');

    var set = factory();
    set.intersectWith([1, 2, 3]);
    assert.equal(set.count(), 3, 'HashSet intersectWith some iterable');
});


qtest('hash-set "isProperSubsetOf" tests', function (assert) {
    var set = factory();

    assert.ok(!set.isProperSubsetOf([]), 'HashSet isProperSubsetOf empty');
    assert.ok(!set.isProperSubsetOf(set), 'HashSet isProperSubsetOf itself');
    assert.ok(!set.isProperSubsetOf(new HashSet([1, 2, 3, 4, 5])), 'HashSet isProperSubsetOf some HashSet');
    assert.ok(!set.isProperSubsetOf([1, 2, 3, 4, 5]), 'HashSet isProperSubsetOf some iterable');

    assert.ok(set.isProperSubsetOf(new HashSet([1, 2, 3, 4, 5, 6])), 'HashSet isProperSubsetOf some HashSet');
    assert.ok(set.isProperSubsetOf([1, 2, 3, 4, 5, 6]), 'HashSet isProperSubsetOf some iterable');
});


qtest('hash-set "isProperSupersetOf" tests', function (assert) {
    var set = factory();

    assert.ok(set.isProperSupersetOf([]), 'HashSet isProperSupersetOf empty');
    assert.ok(set.isProperSupersetOf(new HashSet([1, 2, 3])), 'HashSet isProperSupersetOf some HashSet');
    assert.ok(set.isProperSupersetOf([1, 2, 3]), 'HashSet isProperSupersetOf some iterable');

    assert.ok(!set.isProperSupersetOf(set), 'HashSet isProperSupersetOf itself');
    assert.ok(!set.isProperSupersetOf(new HashSet([0, 1, 2, 3])), 'HashSet isProperSupersetOf some HashSet');
    assert.ok(!set.isProperSupersetOf([0, 1, 2, 3]), 'HashSet isProperSupersetOf some iterable');
});


qtest('hash-set toString', function (assert) {
    assert.equal(new HashSet().toString(), '[HashSet]', 'HashSet toString');
});