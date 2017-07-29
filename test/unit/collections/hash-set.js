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

    set.exceptWith([1, 2, 3]);
    assert.equal(set.count(), 0, 'empty HashSet exceptWith some array');

    var set = factory();
    set.exceptWith([1, 2, 3]);
    assert.equal(set.count(), 2, 'HashSet exceptWith some iterable');
});

qtest('hash-set "intersectWith" tests', function (assert) {
    var set = new HashSet();
    set.intersectWith([1, 2, 3]);
    assert.equal(set.count(), 0, 'empty HashSet intersectWith some array');

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

    assert.ok(new HashSet().isProperSubsetOf([1]), 'empty HashSet isProperSubsetOf some array');
    assert.ok(!new HashSet().isProperSubsetOf([]), 'empty HashSet isProperSubsetOf empty');
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

    assert.ok(!new HashSet().isProperSupersetOf([]), 'HashSet isProperSupersetOf empty');
    assert.ok(!new HashSet().isProperSupersetOf([1]), 'HashSet isProperSupersetOf some array');
    assert.ok(!set.isProperSupersetOf(set), 'HashSet isProperSupersetOf itself');
    assert.ok(!set.isProperSupersetOf(new HashSet([0, 1, 2, 3])), 'HashSet isProperSupersetOf some HashSet');
    assert.ok(!set.isProperSupersetOf([0, 1, 2, 3]), 'HashSet isProperSupersetOf some iterable');
});


qtest('hash-set "isSubsetOf" tests', function (assert) {
    var set = factory();

    assert.ok(new HashSet().isSubsetOf([1]), 'empty HashSet isSubsetOf some array');
    assert.ok(new HashSet().isSubsetOf([]), 'empty HashSet isSubsetOf empty');
    assert.ok(set.isSubsetOf(set), 'HashSet isSubsetOf itself');
    assert.ok(set.isSubsetOf(new HashSet([1, 2, 3, 4, 5])), 'HashSet isSubsetOf some HashSet');
    assert.ok(set.isSubsetOf(new HashSet([1, 2, 3, 4, 5, 6])), 'HashSet isSubsetOf some HashSet');
    assert.ok(set.isSubsetOf([1, 2, 3, 4, 5, 6]), 'HashSet isSubsetOf some iterable');
    assert.ok(set.isSubsetOf([1, 2, 3, 4, 5]), 'HashSet isSubsetOf some iterable same entries');

    assert.ok(!set.isSubsetOf([]), 'HashSet isSubsetOf empty');
    assert.ok(!set.isSubsetOf([1, 2, 3, 4]), 'HashSet isSubsetOf some iterable');
});


qtest('hash-set "isSupersetOf" tests', function (assert) {
    var set = factory();

    assert.ok(set.isSupersetOf([]), 'HashSet isSupersetOf empty');
    assert.ok(set.isSupersetOf(new HashSet([1, 2, 3])), 'HashSet isSupersetOf some HashSet');
    assert.ok(set.isSupersetOf([1, 2, 3]), 'HashSet isSupersetOf some iterable');
    assert.ok(set.isSupersetOf(set), 'HashSet isSupersetOf itself');
    assert.ok(new HashSet().isSupersetOf([]), 'HashSet isSupersetOf empty');

    assert.ok(!new HashSet().isSupersetOf([1]), 'HashSet isSupersetOf some array');
    assert.ok(!set.isSupersetOf(new HashSet([0, 1, 2, 3])), 'HashSet isSupersetOf some HashSet');
    assert.ok(!set.isSupersetOf([0, 1, 2, 3]), 'HashSet isSupersetOf some iterable');
});


qtest('hash-set "overlaps" tests', function (assert) {
    var set = factory();

    assert.ok(!new HashSet().overlaps([]), 'empty HashSet not overlaps');
    assert.ok(!set.overlaps([]), 'HashSet overlaps empty');
    assert.ok(set.overlaps(new HashSet([1, 2, 3])), 'HashSet overlaps some HashSet');
    assert.ok(set.overlaps([1, 2, 3]), 'HashSet overlaps some iterable');
    assert.ok(set.overlaps(set), 'HashSet overlaps itself');

    assert.throws(function () {
        set.overlaps();
    }, 'overlaps null input');
});


qtest('hash-set "remove" tests', function (assert) {
    var set = factory();

    assert.ok(set.remove(1), 'HashSet remove exisiting item');
    assert.ok(!set.remove(1), 'HashSet remove non exisiting item');
});


qtest('hash-set "removeWhere" tests', function (assert) {
    var set = factory();

    assert.ok(set.removeWhere(function (t) {
        return t % 2 === 0;
    }), 'HashSet removeWhere some items');

    assert.throws(function () {
        set.removeWhere();
    }, 'removeWhere null match');

    assert.throws(function () {
        set.removeWhere(1);
    }, 'removeWhere non-function');
});


qtest('hash-set "setEquals" tests', function (assert) {
    var set1 = factory();
    var set2 = factory();

    assert.ok(set1.setEquals(set1), 'HashSet setEquals itself');
    assert.ok(set1.setEquals(set2), 'HashSet setEquals same size, same comparable');

    set2.remove(1);
    assert.ok(!set1.setEquals(set2), 'HashSet setEquals different size, same comparable');

    var comp = {
        hash: function (t) {
            return t;
        },
        equals: function (a, b) {
            return a === b;
        }
    };
    comp.hash(1);
    comp.equals(1, 1);
    set2 = new HashSet([1, 2, 3, 4, 5], comp);
    assert.ok(set1.setEquals(set2), 'HashSet setEquals same size, different comparable');

    assert.throws(function () {
        set1.setEquals();
    }, 'setEquals null input');
});


qtest('hash-set "symmetricExceptWith" tests', function (assert) {
    var set = new HashSet();
    set.symmetricExceptWith(factory());
    assert.equal(set.count(), 5, 'empty HashSet symmetricExceptWith some set');

    var set = factory();
    set.symmetricExceptWith([]);
    assert.equal(set.count(), 5, 'HashSet symmetricExceptWith empty');

    var set = factory();
    set.symmetricExceptWith(set);
    assert.equal(set.count(), 0, 'HashSet symmetricExceptWith itself');

    var set = factory();
    set.symmetricExceptWith(new HashSet([1, 2, 3]));
    assert.equal(set.count(), 2, 'empty HashSet symmetricExceptWith some array');

    var set = factory();
    set.symmetricExceptWith(new HashSet([0, 1, 2, 3, 4, 5, 6]));
    assert.equal(set.count(), 2, 'HashSet symmetricExceptWith some iterable');

    assert.throws(function () {
        set.symmetricExceptWith();
    }, 'symmetricExceptWith null input');
});


qtest('hash-set "unionWith" tests', function (assert) {
    var set1 = factory();
    var set2 = factory();

    set1.unionWith(set1);
    assert.equal(set1.count(), 5, 'HashSet unionWith itself');

    set1.unionWith(set2);
    assert.equal(set1.count(), 5, 'HashSet unionWith a set of same items');

    set1.unionWith(new HashSet([0, 1, 2, 3, 4, 5]));
    assert.equal(set1.count(), 6, 'HashSet unionWith a set of new items');

    assert.throws(function () {
        set1.unionWith();
    }, 'unionWith null input');
});


qtest('hash-set toString', function (assert) {
    assert.equal(new HashSet().toString(), '[HashSet]', 'HashSet toString');
});