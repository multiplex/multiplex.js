module MxTests {
    "use strict";


    /* Classes
    ---------------------------------------------------------------------- */

    // class without equality-comparer
    class SimpleClass {
    };


    // class overriding '__hash__' and '__equals__' methods.
    class SimpleClassWithComparer implements mx.RuntimeComparer {

        constructor(val: number) {
            this.value = val;
            this.name = val.toString();
        }

        public name: string;
        public value: number;

        __hash__(): number {
            return mx.hash(this.value, this.name);
        }

        __equals__(obj: any) {
            return obj instanceof SimpleClassWithComparer && obj.value === this.value && obj.name === this.name;
        }
    };



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateObjectLiteralArray(): Object[] {
        return mx.range(0, 10).select(t => ({})).toArray();
    }


    function CreateComplexObjectLiteralArray(): { name: string; inner: { index: number; val: Object } }[] {
        return mx.range(0, 10).select(t => ({
            name: "n" + t,
            inner: {
                index: t,
                val: {}
            }
        })).toArray();
    }


    function CreateSimpleClassArray(): SimpleClass[] {
        return mx.range(0, 10).select(t => new SimpleClass()).toArray();
    }


    function CreateSimpleClassWithComparerArray(): SimpleClassWithComparer[] {
        return mx.range(0, 10).select(t => new SimpleClassWithComparer(t)).toArray();
    }


    function CreateNumberArray(): number[] {
        return mx.range(0, 10).toArray();
    }


    function CreateFloatNumberArray(): number[] {
        return mx.range(0, 10).select(t => t + 0.1).toArray();
    }


    function CreateStringArray(): string[] {
        return mx.range(0, 10).select(t => t + "_string").toArray();
    }


    function CreateDateArray(): Date[] {
        return mx.range(0, 10).select(t => new Date(new Date().getTime() + t)).toArray();
    }


    function CreateBooleanArray(): boolean[] {
        return mx.range(0, 10).select(t => t % 2 === 0).toArray();
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Linq");


    QUnit.test("aggregate", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).aggregate((a, b) => a + b) === 45, "Aggregate 10 numbers without seed!");
        assert.ok(mx(_arr).aggregate(10, (a, b) => a + b) === 55, "Aggregate 10 numbers with seed!");
        assert.ok(mx(_arr).aggregate(10, (a, b) => a + b, t => t * 2) === 110, "Aggregate 10 numbers with seed and result selector!");
    });


    QUnit.test("all", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).all(t => t < 100) === true, "First 10 numbers less than 100!");
        assert.ok(mx(_arr).all(t => t < 5) === false, "First 10 numbers less than 5!");
    });


    QUnit.test("any", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).any() === true, "First 10 numbers!");
        assert.ok(mx(_arr).any(t => t % 2 === 0) === true, "Any of the first 10 numbers is even!");
        assert.ok(mx(_arr).any(t => t > 10) === false, "Any of the first 10 numbers greater than 10!");
    });


    QUnit.test("average", function (assert) {

        assert.ok(mx(CreateNumberArray()).average() === 4.5, "Average of the first 10 numbers!");
        assert.throws(() => mx(CreateObjectLiteralArray()).average(), "throws an exception for average of non numeric values!");
        assert.throws(() => mx([]).average(), "throws an exception for average of empty collection!");
    });


    QUnit.test("concat", function (assert) {
        var _s1 = [1, 2, 3],
            _s2 = [3, 4],
            _arr = CreateNumberArray();

        assert.deepEqual(mx(_s1).concat(_s2).toArray(), [1, 2, 3, 3, 4], "Concat two array!");
        assert.ok(mx(_arr).concat(_arr).count() === 20, "Concat the first 10 numbers to itself!");
    });


    QUnit.test("contains", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateSimpleClassArray(),
            _arr3 = CreateSimpleClassWithComparerArray(),
            _arr4 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).contains(1) === true, "1 contains in the first 10 numbers!");
        assert.ok(mx(_arr1).contains(10) === false, "10 does not contains in the first 10 numbers!");

        assert.ok(mx(_arr2).contains(new SimpleClass()) === false, "Class instance without equality-comparer!");
        assert.ok(mx(_arr2).contains(new SimpleClass(), { hash: () => 0, equals: () => true }) === true, "Class instance with equality-comparer!");

        assert.ok(mx(_arr3).contains(new SimpleClassWithComparer(5)) === true, "Class instance overriding equality-comparer!");

        assert.ok(mx(_arr4).contains({ name: "n5", inner: { index: 5, val: {} } }) === true, "Object literal without equality-comparer!");
        assert.ok(mx(_arr4).contains({ name: "n5", inner: null }, {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }) === true, "Object literal with equality-comparer!");
    });


    QUnit.test("count", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).count() === 10, "Count of the first 10 numbers!");
        assert.ok(mx(_arr).count(t => t % 2 === 0) === 5, "Count of the first even 10 numbers!");
    });


    QUnit.test("defaultIfEmpty", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx([]).defaultIfEmpty(1).toArray(), [1], "Empty array devalut value!");
        assert.ok(mx(_arr).defaultIfEmpty(1).count() === 10, "Count of the first 10 numbers with defaultIfEmpty!");
        assert.ok(mx(_arr).where(t => t > 100).defaultIfEmpty(10).count() === 1, "Count of the first 10 numbers greater than 100 with defaultIfEmpty!");
    });


    QUnit.test("distinct", function (assert) {

        var _arr1 = CreateObjectLiteralArray(),
            _arr2 = CreateComplexObjectLiteralArray(),
            _arr3 = CreateNumberArray(),
            _arr4 = CreateFloatNumberArray(),
            _arr5 = CreateStringArray(),
            _arr6 = CreateDateArray(),
            _arr7 = CreateBooleanArray(),
            _arr8 = CreateSimpleClassWithComparerArray(),
            _arr9 = CreateSimpleClassArray();

        assert.ok(mx(_arr1).distinct().count() === 1, "Array of 10 empty object literal!");
        assert.ok(mx(_arr2).distinct().count() === 10, "Array of 10 distinct complex object literal!");
        assert.ok(mx(_arr3).distinct().count() === 10, "Array of 10 distinct numbers!");
        assert.ok(mx(_arr4).distinct().count() === 10, "Array of 10 distinct float numbers!");
        assert.ok(mx(_arr5).distinct().count() === 10, "Array of 10 distinct strings!");
        assert.ok(mx(_arr6).distinct().count() === 10, "Array of 10 distinct date objects!");
        assert.ok(mx(_arr7).distinct().count() === 2, "Array of 10 boolean values!");
        assert.ok(mx(_arr8).distinct().count() === 10, "Array of 10 distinct class instances overriding equality-comparer!");
        assert.ok(mx(_arr9).distinct().count() === 10, "Array of 10 distinct class instances!");
        assert.ok(mx(_arr2).distinct({
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).count() === 10, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("except", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateObjectLiteralArray(),
            _arr3 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).except(CreateNumberArray()).count() === 0, "Array of first 10 numbers except first 10 numbers!");
        assert.deepEqual(mx(_arr1).except([0, 1, 2, 3, 4]).toArray(), [5, 6, 7, 8, 9], "Array of first 10 numbers except first 5 numbers!");
        assert.ok(mx(_arr2).except([{}]).count() === 0, "Array of 10 empty object literal except an empty object literal!");
        assert.ok(mx(_arr3).except([{ name: "n5", inner: null }]).count() === 10, "Array of 10 distinct complex object literal without equality-comparer!");
        assert.ok(mx(_arr3).except([{ name: "n5", inner: null }], {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).count() === 9, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("elementAt", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).elementAt(0) === 0, "First element of the first 10 numbers!");
        assert.throws(() => mx(_arr).elementAt(100), "throws an exception for 100th element of the first 10 numbers!");
    });


    QUnit.test("first", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).first() === 0, "First element of the first 10 numbers!");
        assert.ok(mx(_arr).first(t => t > 5) === 6, "First element greater than 5 of the first 10 numbers!");
        assert.throws(() => mx([]).first(), "throws an exception getting first element of an empty collection!");
        assert.throws(() => mx(_arr).first(t => t > 100), "throws an exception getting first element greater than 100 of the first 10 numbers!");
    });


    QUnit.test("firstOrDefault", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).firstOrDefault() === 0, "First element of the first 10 numbers or default!");
        assert.ok(mx(_arr).firstOrDefault(t => t > 5) === 6, "First element greater than 5 of the first 10 numbers or default!");
        assert.ok(mx(_arr).firstOrDefault(t => t > 100) === null, "First element greater than 100 of the first 10 numbers or default!");
        assert.ok(mx(_arr).firstOrDefault(t => t > 100, 100) === 100, "First element greater than 100 of the first 10 numbers or 100 as default!");
    });


    QUnit.test("forEach", function (assert) {

        var _arr = CreateNumberArray(),
            _sum = 0;

        mx(_arr).forEach(t => _sum += t);
        assert.ok(_sum === 45, "ForEach operation on the first 10 numbers!");
    });


    QUnit.test("groupBy", function (assert) {

        var _arr1 = CreateObjectLiteralArray(),
            _arr2 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).groupBy(t => t).count() === 1, "Group 10 distinct empty object literals!");
        assert.ok(mx(_arr2).groupBy(t => t.name).count() === 10, "Group 10 distinct complex object literals by name!");
        assert.ok(mx(_arr2).groupBy(t => t.name).first().key === "n0", "Group 10 distinct complex object literals by name, retrieve first key!");
        assert.ok(mx(_arr2).groupBy(t => t.name).first().count() === 1, "Group 10 distinct complex object literals by name, retrieve first group count!");
    });


    QUnit.test("groupJoin", function (assert) {

        var _arr1 = [{ name: "A", val: 1 }, { name: "B", val: 2 }, { name: "C", val: 3 }, { name: "D", val: 4 }],
            _arr2 = [{ code: "A" }, { code: "A" }, { code: "B" }, { code: "B" }, { code: "C" }],
            _result = mx(_arr1).groupJoin(_arr2, t => t.name, u => u.code, (t, u) => ({ item: t, group: u }));

        assert.ok(_result.count() === 4, "groupJoin 2 complex-object array, getting count");
        assert.ok(_result.first().item.name === "A", "groupJoin 2 complex-object array, getting item");
        assert.ok(_result.first().group.count() === 2, "groupJoin 2 complex-object array, getting group count");
        assert.ok(_result.last().group.count() === 0, "groupJoin 2 complex-object array, getting empty group count");
    });


    QUnit.test("intersect", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateObjectLiteralArray(),
            _arr3 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).intersect(CreateNumberArray()).count() === 10, "Array of first 10 numbers intersect with first 10 numbers!");
        assert.deepEqual(mx(_arr1).intersect([2, 3, 4]).toArray(), [2, 3, 4], "Array of first 10 numbers intersect with 3 numbers!");
        assert.ok(mx(_arr2).intersect([{}]).count() === 10, "Array of 10 empty object literal intersect with an empty object literal!");
        assert.ok(mx(_arr3).intersect([{ name: "n5", inner: null }]).count() === 0, "Array of 10 distinct complex object literal without equality-comparer!");
        assert.ok(mx(_arr3).intersect([{ name: "n5", inner: null }], {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).count() === 1, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("join", function (assert) {
        var _arr1 = [{ name: "A", val: 1 }, { name: "B", val: 2 }, { name: "C", val: 3 }, { name: "D", val: 4 }],
            _arr2 = [{ code: "A" }, { code: "A" }, { code: "B" }, { code: "B" }, { code: "C" }],
            _arr3 = CreateObjectLiteralArray(),
            _result = mx(_arr1).join(_arr2, t => t.name, u => u.code, (t, u) => ({ item1: t, item2: u }));

        assert.ok(_result.count() === 5, "join 2 complex-object array, getting count");
        assert.ok(_result.first().item1.name === "A" && _result.first().item2.code === "A", "join 2 complex-object array, getting item");
        assert.ok(mx(_arr3).join(mx(CreateObjectLiteralArray()), t => t, u => u, (t, u) => t).count() === 100, "join 2 empty object-literal array");
        assert.ok(mx(mx.empty()).join(mx(_arr3), t => t, u => u, (t, u) => t).count() === 0, "join empty collection with an array");
    });


    QUnit.test("last", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).last() === 9, "Last element of the first 10 numbers!");
        assert.ok(mx(_arr).last(t => t < 5) === 4, "Last element less than 5 of the first 10 numbers!");
        assert.throws(() => mx([]).last(), "throws an exception getting last element of an empty collection!");
        assert.throws(() => mx(_arr).last(t => t > 100), "throws an exception getting first element greater than 100 of the first 10 numbers!");
    });


    QUnit.test("lastOrDefault", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).lastOrDefault() === 9, "Last element of the first 10 numbers or default!");
        assert.ok(mx(_arr).lastOrDefault(t => t < 5) === 4, "Last element greater than 5 of the first 10 numbers or default!");
        assert.ok(mx(_arr).lastOrDefault(t => t > 100) === null, "Last element greater than 100 of the first 10 numbers or default!");
        assert.ok(mx(_arr).lastOrDefault(t => t > 100, 100) === 100, "Last element greater than 100 of the first 10 numbers or 100 as default!");
    });


    QUnit.test("max", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateStringArray(),
            _arr3 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).max() === 9, "Maximum of the first 10 numbers!");
        assert.ok(mx(_arr2).max() === "9_string", "Maximum of the 10 string array!");
        assert.ok(mx(_arr3).max(t => t.name) === "n9", "Maximum of a complex array by selector!");
        assert.throws(() => mx([]).max(), "throws an exception getting maximum of an empty collection!");
    });


    QUnit.test("min", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateStringArray(),
            _arr3 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).min() === 0, "Minimum of the first 10 numbers!");
        assert.ok(mx(_arr2).min() === "0_string", "Minimum of the 10 string array!");
        assert.ok(mx(_arr3).min(t => t.name) === "n0", "Minimum of a complex array by selector!");
        assert.throws(() => mx([]).min(), "throws an exception getting minimum of an empty collection!");
    });


    QUnit.test("ofType", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).ofType(Number).count() === 10, "Cast array of numbers to number!");
        assert.ok(mx(_arr).ofType(String).count() === 0, "Cast array of numbers to string!");
    });


    QUnit.test("orderBy", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateComplexObjectLiteralArray(),
            _arr3 = [{ name: "a", val: 1 }, { name: "a", val: 2 }, { name: "b", val: 1 }, { name: "c", val: 2 }],
            _result = [{ name: "a", val: 1 }, { name: "b", val: 1 }, { name: "a", val: 2 }, { name: "c", val: 2 }]

        assert.deepEqual(mx(_arr1).orderBy(t => t).take(5).toArray(), [0, 1, 2, 3, 4], "Order array of numbers ascending!");
        assert.ok(mx(_arr2).orderBy(t => t.name).thenByDescending(t => t.inner.index).first().name === "n0", "Order array of complex object by 'name' ascending then by 'inner.index' descending !");
        assert.deepEqual(mx(_arr3).orderBy(t => t.val).thenBy(t => t.name).toArray(), _result, "Order and thenBy!");
        assert.ok(mx(_arr2).orderBy(t => t.name, {
            hash: o => mx.hash(o),
            equals: (a, b) => a === b
        }).first().name === "n0", "Order array of complex object ascending with comparer!");
    });


    QUnit.test("orderByDescending", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateComplexObjectLiteralArray(),
            _arr3 = [{ name: "a", val: 1 }, { name: "a", val: 2 }, { name: "b", val: 1 }, { name: "c", val: 2 }],
            _result = [{ name: "a", val: 2 }, { name: "c", val: 2 }, { name: "a", val: 1 }, { name: "b", val: 1 }];

        assert.deepEqual(mx(_arr1).orderByDescending(t => t).take(5).toArray(), [9, 8, 7, 6, 5], "Order array of numbers descending!");
        assert.ok(mx(_arr2).orderByDescending(t => t.name).thenByDescending(t => t.inner.index).first().name === "n9", "Order array of complex object by 'name' descending then by 'inner.index' descending !");
        assert.deepEqual(mx(_arr3).orderByDescending(t => t.val).thenBy(t => t.name).toArray(), _result, "Order descending and thenBy!");
        assert.ok(mx(_arr2).orderByDescending(t => t.name, {
            hash: o => mx.hash(o),
            equals: (a, b) => a === b
        }).first().name === "n9", "Order array of complex object descending with comparer!");
    });


    QUnit.test("reverse", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateStringArray();

        assert.deepEqual(mx(_arr1).reverse().take(5).toArray(), [9, 8, 7, 6, 5], "Reverse array of first 10 numbers!");
        assert.ok(mx(_arr2).reverse().first() === "9_string", "Reverse array of strings!");
    });


    QUnit.test("sequenceEqual", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).sequenceEqual(mx(CreateNumberArray())), "sequenceEqual on array of numbers!");
        assert.ok(mx([1, 2, 3]).sequenceEqual(mx([1, 2])) === false, "sequenceEqual on inharmonic arrays of numbers!");
        assert.ok(mx([{ name: "a" }]).sequenceEqual(mx([{ name: "a", val: 1 }]), {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }), "sequenceEqual on arrays of objects with comparer!");
    });


    QUnit.test("select", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).select(t => t + 100).first() === 100, "select first 10 numbers plus 100!");
        assert.ok(mx(_arr).select((t, i) => i).last() === 9, "select index while enumerating 10 numbers!");
    });


    QUnit.test("selectMany", function (assert) {

        var _arr = [{ name: "A", values: [1, 2, 3, 4] }, { name: "B", values: [5, 6, 7, 8] }];

        assert.ok(mx(_arr).selectMany(t => t.values).count() === 8, "selectMany on complex objects!");
        assert.deepEqual(mx(_arr).selectMany(t => t.values, (t, u) => ({ name: t.name, value: u })).first(), { name: "A", value: 1 }, "selectMany on complex objects with result selector!");
    });


    QUnit.test("single", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx([1]).single() === 1, "Single element of a single array!");
        assert.ok(mx(_arr).single(t => t === 1) === 1, "Single element equal to 1 of the first 10 numbers!");
        assert.throws(() => mx([]).single(), "throws an exception getting single element of an empty collection!");
        assert.throws(() => mx(_arr).single(), "throws an exception getting single element of an collection containing more than one element!");
        assert.throws(() => mx(_arr).single(t => t > 100), "throws an exception getting single element greater than 100 of the first 10 numbers!");
        assert.throws(() => mx(_arr).single(t => t < 10), "throws an exception getting single element less than 10 of the first 10 numbers!");
    });


    QUnit.test("singleOrDefault", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx([1]).singleOrDefault() === 1, "Single element of a single array or default!");
        assert.ok(mx([]).singleOrDefault() === null, "Single element of an empty array or default!");
        assert.ok(mx(_arr).singleOrDefault(t => t === 1) === 1, "Single element equal to 1 of the first 10 numbers or default!");
        assert.ok(mx(_arr).singleOrDefault(t => t === 100, 100) === 100, "Single element of an empty array or default!");
        assert.throws(() => mx(_arr).singleOrDefault(), "throws an exception getting single element of an collection containing more than one element!");
        assert.throws(() => mx(_arr).singleOrDefault(t => t < 10), "throws an exception getting single element less than 10 of the first 10 numbers!");
    });


    QUnit.test("skip", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx(_arr).skip(5).toArray(), [5, 6, 7, 8, 9], "Skip 5 element of a the first 10 numbers!");
        assert.deepEqual(mx(_arr).where(t => t % 2 === 0).skip(3).toArray(), [6, 8], "Skip 3 element of a the first 10 even numbers!");
        assert.ok(mx(_arr).skip(0).count() === 10, "Skip no items!");
        assert.ok(mx(_arr).skip(100).count() === 0, "Skip more than count of the collection!");
    });


    QUnit.test("skipWhile", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx(_arr).skipWhile(t => t < 5).toArray(), [5, 6, 7, 8, 9], "Skip while elements are less than 5 from the first 10 even numbers!");
        assert.ok(mx(_arr).skipWhile(t => t > 5).count() === 10, "Skip while elements are greater than 5 from the first 10 even numbers!");
    });


    QUnit.test("sum", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).sum() === 45, "Sum of the first 10 numbers!");
        assert.ok(mx(_arr).sum(t => t * 2) === 90, "Sum of the first 10 numbers multiply by 2!");
        assert.throws(() => mx(CreateObjectLiteralArray()).sum(), "throws an exception getting sum of non numeric elements!");
        assert.throws(() => mx(CreateComplexObjectLiteralArray()).sum(t => <any>t.name), "throws an exception getting sum of non numeric properties!");
    });


    QUnit.test("take", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx(_arr).take(5).toArray(), [0, 1, 2, 3, 4], "Take 5 element of a the first 10 numbers!");
        assert.deepEqual(mx(_arr).where(t => t % 2 === 0).take(3).toArray(), [0, 2, 4], "Take 3 element of a the first 10 even numbers!");
        assert.ok(mx(_arr).take(0).count() === 0, "Take no items!");
        assert.ok(mx(_arr).take(100).count() === 10, "Take more than count of the collection!");
    });


    QUnit.test("takeWhile", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx(_arr).takeWhile(t => t < 5).toArray(), [0, 1, 2, 3, 4], "Take while elements are less than 5 from the first 10 even numbers!");
        assert.ok(mx(_arr).takeWhile(t => t > 5).count() === 0, "Take while elements are greater than 5 from the first 10 even numbers!");
    });


    QUnit.test("toArray", function (assert) {

        var _arr = CreateNumberArray();

        assert.deepEqual(mx(_arr).where(t => t < 5).toArray(), [0, 1, 2, 3, 4], "Elements less than 5 from the first 10 even numbers!");
    });


    QUnit.test("toDictionary", function (assert) {

        var _arr = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr).toDictionary(t => t.name).count() === 10, "toDictionary key-selector!");
        assert.ok(mx(_arr).toDictionary(t => t.name, t => t.inner.index).first().value === 0, "toDictionary key-selector & element-selector!");
        assert.ok(mx(_arr).toDictionary(t => t, {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).first().key.name === "n0", "toDictionary key-selector & comparer!");

        assert.ok(mx(_arr).toDictionary(t => t, t => t.inner.index, {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).first().value === 0, "toDictionary key-selector, element-selector & comparer!");

        assert.throws(() => mx([1, 1, 2]).toDictionary(t => t), "throws an exception with duplicate keys!");
    });


    QUnit.test("toList", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).toList().count() === 10, "toList first 10 numbers!");
        assert.ok(mx(_arr).toList()[1] === 1, "toList indexer first 10 numbers!");
    });


    QUnit.test("toLookup", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).toLookup(t => t).count() === 10, "toLookup first 10 numbers!");
        assert.ok(mx(_arr1).toLookup(t => t).get(1).count() === 1, "toLookup indexer first 10 numbers!");

        assert.ok(mx(_arr2).toLookup(t => t, {
            hash: o => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).first().first().name === "n0", "toLookup with key-selector and comparer!");

        assert.ok(mx(_arr2).toLookup(t => t, t => t.name, {
            hash: (o) => mx.hash(o.name),
            equals: (a, b) => a.name === b.name
        }).first().first() === "n0", "toLookup with key-selector, element-selector and comparer!");
    });


    QUnit.test("union", function (assert) {

        var _arr = CreateNumberArray();

        assert.ok(mx(_arr).union(CreateNumberArray()).count() === 10, "Union first 10 numbers with itself!");
        assert.deepEqual(mx([1, 2]).union(mx([2, 3])).toArray(), [1, 2, 3], "Union two arrays!");
    });


    QUnit.test("where", function (assert) {

        var _arr1 = CreateNumberArray(),
            _arr2 = CreateComplexObjectLiteralArray();

        assert.ok(mx(_arr1).where(t => t < 5).count() === 5, "Filter first 10 numbers less than 10!");
        assert.ok(mx(_arr2).where(t => t.inner.index < 5).count() === 5, "Filter complex object by value!");
        assert.deepEqual(mx(_arr1).where(t => t <= 1).toArray(), [0, 1], "Deep equal check!");
    });


    QUnit.test("zip", function (assert) {

        assert.ok(mx([1, 2]).zip([3, 4], (t, u) => t + u).first() === 4, "Zip two numeric array!");
        assert.ok(mx([1, 2]).zip([3], (t, u) => t + u).count() === 1, "Zip two inharmonic numeric array!");
    });
}