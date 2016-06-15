module MxTests {
    "use strict";

    import HashSet = mx.HashSet;

    var HashSet = mx.HashSet,
        EqualityComparer = mx.EqualityComparer;


    /* Factory methods
    ---------------------------------------------------------------------- */

    interface SimpleObject {
        name: string;
        value: number;
    }


    function CreateNumericHashSet(): HashSet<number> {
        return new HashSet<number>(mx.range(1, 5));
    }


    function CreateObjectHashSet(): HashSet<SimpleObject> {

        var _items: SimpleObject[] = [{ name: "A", value: 1 }, { name: "A", value: 2 }, { name: "B", value: 3 }, { name: "B", value: 4 }],
            _comparer = EqualityComparer.create<SimpleObject>(obj => mx.hash(obj.name), (a, b) => a.name === b.name);

        return new HashSet<SimpleObject>(_items, _comparer);
    }
    


    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Hashset");


    QUnit.test("constructor", function (assert) {

        assert.ok(new HashSet<number>().count() === 0, "initialize an empty HashSet!");
        assert.ok(new HashSet<number>(mx.range(1, 5)).count() === 5, "initialize a HashSet using specified collection!");
        assert.ok(new HashSet<number>(mx.EqualityComparer.defaultComparer).count() === 0, "initialize a HashSet using specified equality comparer!");
        assert.ok(CreateObjectHashSet().count() === 2, "initialize a HashSet using specified collection and equality comparer!");
    });


    QUnit.test("add", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.add(6) === true, "add item to a HashSet of numbers!");
        assert.ok(_hash1.add(1) === false, "add existing item to a HashSet of numbers!");
        assert.ok(_hash2.add({ name: "C", value: 5 }) === true, "add item to a HashSet of objects!");
        assert.ok(_hash2.add({ name: "A", value: 5 }) === false, "add an existing item to a HashSet of objects!");
    });


    QUnit.test("clear", function (assert) {

        var _hash = CreateNumericHashSet();

        _hash.clear();
        assert.ok(_hash.count() === 0, "clear a HashSet!");
    });


    QUnit.test("contains", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.contains(1) === true, "HashSet of numbers contains an item!");
        assert.ok(_hash1.contains(6) === false, "HashSet of numbers does not contain an item!");
        assert.ok(_hash2.contains({ name: "A", value: 5 }) === true, "HashSet of objects contains an item!");
        assert.ok(_hash2.contains({ name: "C", value: 5 }) === false, "HashSet of objects does not contain an item!");
    });


    QUnit.test("copyTo", function (assert) {

        var _hash = CreateNumericHashSet(),
            _arr = new Array(_hash.count());

        _hash.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "HashSet copy to an array!");
        assert.throws(() => _hash.copyTo([], 0), "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("comparer", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.comparer() === mx.EqualityComparer.defaultComparer, "HashSet default comparer!");
        assert.ok(_hash2.comparer().equals({ name: "A", value: 1 }, { name: "A", value: 2 }), "HashSet custom comparer!");
    });


    QUnit.test("remove", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.remove(1) === true, "HashSet of numbers remove an item!");
        assert.ok(_hash1.remove(1) === false, "HashSet of numbers remove non existing item!");
        assert.ok(_hash2.remove({ name: "A", value: 1 }) === true, "HashSet of objects remove an item!");
        assert.ok(_hash2.remove({ name: "A", value: 1 }) === false, "HashSet of objects remove non existing item!");
    });


    QUnit.test("removeWhere", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.removeWhere(t => t < 3) === 2, "HashSet of numbers remove with predicate, get number of items removed!");
        assert.ok(_hash1.removeWhere(t => t < 3) === 0, "HashSet of numbers remove with invalid predicate, get number of items removed!");
        assert.ok(_hash1.count() === 3, "HashSet of numbers remove with predicate, get count!");

        assert.ok(_hash2.removeWhere(t => t.value < 3) === 1, "HashSet of objects remove with predicate, get number of items removed!");
        assert.ok(_hash2.removeWhere(t => t.value < 3) === 0, "HashSet of objects remove with invalid predicate, get number of items removed!");
        assert.ok(_hash2.count() === 1, "HashSet of objects remove with predicate, get count!");
    });


    QUnit.test("exceptWith", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet(),
            _hash3 = CreateNumericHashSet();

        _hash1.exceptWith([1, 2, 3]);
        _hash2.exceptWith([{ name: "A", value: 0 }]);
        _hash3.exceptWith(CreateNumericHashSet());

        assert.ok(_hash1.count() === 2 && _hash1.contains(1) === false, "HashSet of numbers except a collection, get count!");
        assert.ok(_hash2.count() === 1 && _hash2.contains({ name: "A", value: 0 }) === false, "HashSet of objects except a collection, get count!");
        assert.ok(_hash3.count() === 0, "HashSet of numbers except an equal set, get count!");
    });


    QUnit.test("intersectWith", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet(),
            _hash3 = CreateNumericHashSet();

        _hash1.intersectWith([1, 2, 3]);
        _hash2.intersectWith([{ name: "A", value: 0 }]);
        _hash3.intersectWith(CreateNumericHashSet());

        assert.ok(_hash1.count() === 3 && _hash1.contains(1) === true, "HashSet of numbers intersect with a collection, get count!");
        assert.ok(_hash2.count() === 1 && _hash2.contains({ name: "A", value: 0 }) === true, "HashSet of objects intersect with a collection, get count!");
        assert.ok(_hash3.count() === 5, "HashSet of numbers intersect with an equal set, get count!");
    });


    QUnit.test("isProperSubsetOf", function (assert) {

        var _hash = CreateNumericHashSet();

        assert.ok(new HashSet<number>().isProperSubsetOf([1, 2, 3]) === true, "an empty set is a proper subset of any other collection!");
        assert.ok(new HashSet<number>().isProperSubsetOf([]) === false, "an empty set is not a proper subset of another empty collection!");
        assert.ok(_hash.isProperSubsetOf([1, 2, 3, 4]) === false, "a hash set is not a proper subset of another collection when count is greater than the number of elements in other!");
        assert.ok(_hash.isProperSubsetOf([1, 2, 3, 4, 5]) === false, "a hash set is not a proper subset of another collection when count is equal to the number of elements in other!");
        assert.ok(_hash.isProperSubsetOf([1, 2, 3, 4, 5, 6]) === true, "hash set proper subset!");
    });


    QUnit.test("isProperSupersetOf", function (assert) {

        var _hash = CreateNumericHashSet();

        assert.ok(new HashSet<number>().isProperSupersetOf([1, 2, 3]) === false, "an empty set is a not superset of any other collection!");
        assert.ok(new HashSet<number>().isProperSupersetOf([]) === false, "an empty set is not a proper superset of another empty collection!");
        assert.ok(_hash.isProperSupersetOf([1, 2, 3, 4, 5, 6]) === false, "a hash set is not a proper superset of another collection when count is less than the number of elements in other!");
        assert.ok(_hash.isProperSupersetOf([1, 2, 3, 4, 5]) === false, "a hash set is not a proper superset of another collection when count is equal to the number of elements in other!");
        assert.ok(_hash.isProperSupersetOf([1, 2, 3]) === true, "hash set proper superset!");
    });


    QUnit.test("isSubsetOf", function (assert) {

        var _hash = CreateNumericHashSet();

        assert.ok(new HashSet<number>().isSubsetOf([1, 2, 3]) === true, "an empty set is a subset of any other collection!");
        assert.ok(new HashSet<number>().isSubsetOf([]) === true, "an empty set is a subset of another empty collection!");
        assert.ok(_hash.isSubsetOf([1, 2, 3, 4]) === false, "a hash set is not a subset of another collection when count is greater than the number of elements in other!");
        assert.ok(_hash.isSubsetOf([1, 2, 3, 4, 5]) === true, "a hash set is a proper subset of another collection when count is equal to the number of elements in other!");
        assert.ok(_hash.isSubsetOf([1, 2, 3, 4, 5, 6]) === true, "hash set subset!");
    });


    QUnit.test("isSupersetOf", function (assert) {

        var _hash = CreateNumericHashSet();

        assert.ok(new HashSet<number>().isSupersetOf([1, 2, 3]) === false, "an empty set is a not superset of any other collection!");
        assert.ok(new HashSet<number>().isSupersetOf([]) === true, "an empty set is superset of another empty collection!");
        assert.ok(_hash.isSupersetOf([1, 2, 3, 4, 5, 6]) === false, "a hash set is not a superset of another collection when count is less than the number of elements in other!");
        assert.ok(_hash.isSupersetOf([1, 2, 3, 4, 5]) === true, "a hash set is a proper superset of another collection when count is equal to the number of elements in other!");
        assert.ok(_hash.isSupersetOf([1, 2, 3]) === true, "hash set superset!");
    });


    QUnit.test("overlaps", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.ok(_hash1.overlaps([1, 2, 3]) === true, "HashSet of numbers overlaps with another collection!");
        assert.ok(_hash2.overlaps([{ name: "A", value: 0 }]) === true, "HashSet of objects overlaps with another collection!");
        assert.ok(new HashSet().overlaps([1, 2, 3]) === false, "an empty HashSet does not overlap with another collection!");
    });


    QUnit.test("setEquals", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateNumericHashSet();

        assert.ok(_hash1.setEquals(_hash2) === true, "HashSet of numbers equals with another HashSet!");
        assert.ok(_hash1.setEquals([1, 2, 3, 4, 5]) === true, "HashSet of numbers equals with another collection!");
        assert.ok(new HashSet<number>().setEquals([]) === true, "an empty HashSet equals with an empty collection!");
        assert.ok(new HashSet<number>().setEquals([1, 2, 3]) === false, "an empty HashSet does not equals with another collection!");
    });


    QUnit.test("symmetricExceptWith", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet(),
            _hash3 = CreateNumericHashSet();

        _hash1.symmetricExceptWith([2, 3, 4]);
        _hash2.symmetricExceptWith([{ name: "A", value: 0 }]);
        _hash3.exceptWith(CreateNumericHashSet());

        assert.ok(_hash1.count() === 2, "HashSet of numbers symmetric except another collection, get count!");
        assert.ok(_hash1.contains(1) === true && _hash1.contains(5) === true, "HashSet of numbers symmetric except another collection, check contains!");
        assert.ok(_hash2.count() === 1, "HashSet of objects symmetric except another collection, get count!");
        assert.ok(_hash2.contains({ name: "A", value: 0 }) === false && _hash2.contains({ name: "B", value: 0 }) === true, "HashSet of objects symmetric except another collection, check contains!");
        assert.ok(_hash3.count() === 0, "HashSet of numbers symmetric except an equal set, get count!");
    });


    QUnit.test("unionWith", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet(),
            _hash3 = CreateNumericHashSet();

        _hash1.unionWith([5, 6, 7, 8]);
        _hash2.unionWith([{ name: "A", value: 5 }, { name: "B", value: 6 }, { name: "C", value: 7 }, { name: "D", value: 8 }]);
        _hash3.unionWith(CreateNumericHashSet());

        assert.ok(_hash1.count() === 8, "HashSet of numbers union with another collection, get count!");
        assert.ok(_hash1.contains(1) === true && _hash1.contains(8) === true, "HashSet of numbers union with another collection, check contains!");
        assert.ok(_hash2.count() === 4, "HashSet of objects union with another collection, get count!");
        assert.ok(_hash2.contains({ name: "A", value: 0 }) === true && _hash2.contains({ name: "D", value: 0 }) === true, "HashSet of objects union with another collection, check contains!");
        assert.ok(_hash3.count() === 5, "HashSet of numbers union with an equal set, get count!");
    });


    QUnit.test("set enumerable", function (assert) {

        var _hash1 = CreateNumericHashSet(),
            _hash2 = CreateObjectHashSet();

        assert.deepEqual(_hash1.select(t => t * 2).where(t => t > 5).toArray(), [6, 8, 10], "select-where-toArray over a HashSet of numbers!");
        assert.deepEqual(_hash2.select(t => t.value * 2).where(t => t > 5).toArray(), [6], "select-where-toArray over a HashSet of objects!");
    });
}