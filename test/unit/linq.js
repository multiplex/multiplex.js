/// <reference path="../data/_references.js" />


(function (global) {

    var FooWithEqualityComparer = global.FooWithEqualityComparer,
        Foo = global.Foo,
        TestContext = global.TestContext;


    TestContext.initialize(10);

    QUnit.module("Linq");


    QUnit.test("aggregate", function (assert) {
        assert.ok(mx(TestContext.arr5).aggregate("(a, b) => a + b") === 45, "Aggregate 10 numbers without seed!");
        assert.ok(mx(TestContext.arr5).aggregate(10, "(a, b) => a + b") === 55, "Aggregate 10 numbers with seed!");
        assert.ok(mx(TestContext.arr5).aggregate(10, "(a, b) => a + b", "t => t * 2") === 110, "Aggregate 10 numbers with seed and result selector!");
    });


    QUnit.test("all", function (assert) {
        assert.ok(mx(TestContext.arr5).all("t => t < 100") === true, "First 10 numbers less than 100!");
        assert.ok(mx(TestContext.arr5).all("t => t < 5") === false, "First 10 numbers less than 5!");
    });


    QUnit.test("any", function (assert) {
        assert.ok(mx(TestContext.arr5).any() === true, "First 10 numbers!");
        assert.ok(mx(TestContext.arr5).any("t => t % 2 === 0") === true, "Any of the first 10 numbers is even!");
        assert.ok(mx(TestContext.arr5).any("t => t > 10") === false, "Any of the first 10 numbers greater than 10!");
    });


    QUnit.test("average", function (assert) {
        assert.ok(mx(TestContext.arr5).average() === 4.5, "Average of the first 10 numbers!");

        assert.throws(function () {
            mx(TestContext.arr1).average();
        }, "throws an exception for average of non numeric values!");

        assert.throws(function () {
            mx([]).average();
        }, "throws an exception for average of empty collection!");
    });


    QUnit.test("concat", function (assert) {
        var _s1 = [1, 2, 3],
            _s2 = [3, 4];

        assert.deepEqual(mx(_s1).concat(_s2).toArray(), [1, 2, 3, 3, 4], "Concat two array!");
        assert.ok(mx(TestContext.arr5).concat(TestContext.arr5).count() === 20, "Concat the first 10 numbers to itself!");
    });


    QUnit.test("contains", function (assert) {

        var _foo = new Foo(),
            _bar = new FooWithEqualityComparer(5),
            _obj1 = { name: "n5", inner: { index: 5, val: {} } },
            _obj2 = { name: "n5" };

        assert.ok(mx(TestContext.arr5).contains(1) === true, "1 contains in the first 10 numbers!");
        assert.ok(mx(TestContext.arr5).contains(10) === false, "10 does not contains in the first 10 numbers!");


        assert.ok(mx(TestContext.arr3).contains(_foo) === false, "Class instance without equality-comparer!");
        assert.ok(mx(TestContext.arr3).contains(_foo, {
            hash: function () { return 0; },
            equals: function () { return true; }
        }) === true, "Class instance with equality-comparer!");


        assert.ok(mx(TestContext.arr2).contains(_obj1) === true, "Object literal without equality-comparer!");
        assert.ok(mx(TestContext.arr2).contains(_obj2, {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }) === true, "Object literal with equality-comparer!");


        assert.ok(mx(TestContext.arr4).contains(_bar) === true, "Class instance overriding equality-comparer!");
    });


    QUnit.test("count", function (assert) {
        assert.ok(mx(TestContext.arr5).count() === 10, "Count of the first 10 numbers!");
        assert.ok(mx(TestContext.arr5).count("t => t % 2") === 5, "Count of the first even 10 numbers!");
    });


    QUnit.test("defaultIfEmpty", function (assert) {
        assert.deepEqual(mx([]).defaultIfEmpty(1).toArray(), [1], "Empty array devalut value!");
        assert.ok(mx(TestContext.arr5).defaultIfEmpty(1).count() === 10, "Count of the first 10 numbers with defaultIfEmpty!");
        assert.ok(mx(TestContext.arr5).where("t => t > 100").defaultIfEmpty(10).count() === 1, "Count of the first 10 numbers greater than 100 with defaultIfEmpty!");
    });


    QUnit.test("distinct", function (assert) {
        assert.ok(mx(TestContext.arr1).distinct().count() === 1, "Array of 10 empty object literal!");
        assert.ok(mx(TestContext.arr2).distinct().count() === 10, "Array of 10 distinct complex object literal!");
        assert.ok(mx(TestContext.arr5).distinct().count() === 10, "Array of 10 distinct numbers!");
        assert.ok(mx(TestContext.arr6).distinct().count() === 10, "Array of 10 distinct float numbers!");
        assert.ok(mx(TestContext.arr7).distinct().count() === 10, "Array of 10 distinct float strings!");
        assert.ok(mx(TestContext.arr8).distinct().count() === 10, "Array of 10 distinct date objects!");
        assert.ok(mx(TestContext.arr9).distinct().count() === 2, "Array of 10 boolean values!");

        assert.ok(mx(TestContext.arr3).distinct().count() === 10, "Array of 10 distinct class instances overriding equality-comparer!");

        assert.ok(mx(TestContext.arr4).distinct().count() === 10, "Array of 10 distinct class instances!");

        assert.ok(mx(TestContext.arr2).distinct({
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).count() === 10, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("except", function (assert) {

        var _obj = { name: "n5" };

        assert.ok(mx(TestContext.arr5).except(TestContext.arr5_clone).count() === 0, "Array of first 10 numbers except first 10 numbers!");
        assert.deepEqual(mx(TestContext.arr5).except([0, 1, 2, 3, 4]).toArray(), [5, 6, 7, 8, 9], "Array of first 10 numbers except first 5 numbers!");

        assert.ok(mx(TestContext.arr1).except([{}]).count() === 0, "Array of 10 empty object literal except an empty object literal!");

        assert.ok(mx(TestContext.arr2).except([_obj]).count() === 10, "Array of 10 distinct complex object literal without equality-comparer!");

        assert.ok(mx(TestContext.arr2).except([_obj], {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).count() === 9, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("elementAt", function (assert) {

        assert.ok(mx(TestContext.arr5).elementAt(0) === 0, "First element of the first 10 numbers!");
        assert.throws(function () {
            mx(TestContext.arr5).elementAt(100);
        }, "throws an exception for 100th element of the first 10 numbers!");
    });


    QUnit.test("first", function (assert) {

        assert.ok(mx(TestContext.arr5).first() === 0, "First element of the first 10 numbers!");
        assert.ok(mx(TestContext.arr5).first("t => t > 5") === 6, "First element greater than 5 of the first 10 numbers!");

        assert.throws(function () {
            mx([]).first();
        }, "throws an exception getting first element of an empty collection!");

        assert.throws(function () {
            mx(TestContext.arr5).first("t => t > 100");
        }, "throws an exception getting first element greater than 100 of the first 10 numbers!");
    });


    QUnit.test("firstOrDefault", function (assert) {

        assert.ok(mx(TestContext.arr5).firstOrDefault() === 0, "First element of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).firstOrDefault("t => t > 5") === 6, "First element greater than 5 of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).firstOrDefault("t => t > 100") === null, "First element greater than 100 of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).firstOrDefault("t => t > 100", 100) === 100, "First element greater than 100 of the first 10 numbers or 100 as default!");
    });


    QUnit.test("forEach", function (assert) {

        var _sum = 0;
        mx(TestContext.arr5).forEach(function (t) { _sum += t; });
        assert.ok(_sum === 45, "ForEach operation on the first 10 numbers!");
    });


    QUnit.test("groupBy", function (assert) {

        assert.ok(mx(TestContext.arr1).groupBy("t => t").count() === 1, "Group 10 distinct empty object literals!");
        assert.ok(mx(TestContext.arr2).groupBy("t => t.name").count() === 10, "Group 10 distinct complex object literals by name!");
        assert.ok(mx(TestContext.arr2).groupBy("t => t.name").first().key === "n0", "Group 10 distinct complex object literals by name, retrieve first key!");
        assert.ok(mx(TestContext.arr2).groupBy("t => t.name").first().count() === 1, "Group 10 distinct complex object literals by name, retrieve first group count!");
    });


    QUnit.test("groupJoin", function (assert) {

        var _arr1 = [{ name: "A", val: 1 }, { name: "B", val: 2 }, { name: "C", val: 3 }, { name: "D", val: 4 }];
        var _arr2 = [{ code: "A" }, { code: "A" }, { code: "B" }, { code: "B" }, { code: "C" }];
        var _result = mx(_arr1).groupJoin(_arr2, "t => t.name", "u => u.code", "(t, u) => {item: t, group: u}");

        assert.ok(_result.count() === 4, "groupJoin 2 complex-object array, getting count");
        assert.ok(_result.first().item.name === "A", "groupJoin 2 complex-object array, getting item");
        assert.ok(_result.first().group.count() === 2, "groupJoin 2 complex-object array, getting group count");
        assert.ok(_result.last().group.count() === 0, "groupJoin 2 complex-object array, getting empty group count");
    });


    QUnit.test("intersect", function (assert) {

        var _obj = { name: "n5" };

        assert.ok(mx(TestContext.arr5).intersect(TestContext.arr5_clone).count() === 10, "Array of first 10 numbers intersect with first 10 numbers!");
        assert.deepEqual(mx(TestContext.arr5).intersect([2, 3, 4]).toArray(), [2, 3, 4], "Array of first 10 numbers intersect with 3 numbers!");

        assert.ok(mx(TestContext.arr1).intersect([{}]).count() === 10, "Array of 10 empty object literal intersect with an empty object literal!");

        assert.ok(mx(TestContext.arr2).intersect([_obj]).count() === 0, "Array of 10 distinct complex object literal without equality-comparer!");

        assert.ok(mx(TestContext.arr2).intersect([_obj], {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).count() === 1, "Array of 10 distinct complex object literal with equality-comparer!");
    });


    QUnit.test("join", function (assert) {
        var _arr1 = [{ name: "A", val: 1 }, { name: "B", val: 2 }, { name: "C", val: 3 }, { name: "D", val: 4 }];
        var _arr2 = [{ code: "A" }, { code: "A" }, { code: "B" }, { code: "B" }, { code: "C" }];
        var _result = mx(_arr1).join(_arr2, "t => t.name", "u => u.code", "(t, u) => {item1: t, item2: u}");

        assert.ok(_result.count() === 5, "join 2 complex-object array, getting count");
        assert.ok(_result.first().item1.name === "A" && _result.first().item2.code === "A", "join 2 complex-object array, getting item");
        assert.ok(mx(TestContext.arr1).join(mx(TestContext.arr1_clone), "t => t", "u => u", "(t, u) => t").count() === 100, "join 2 empty object-literal array");
        assert.ok(mx(mx.empty()).join(mx(TestContext.arr1), "t => t", "u => u", "(t, u) => t").count() === 0, "join empty collection with an array");
    });


    QUnit.test("last", function (assert) {

        assert.ok(mx(TestContext.arr5).last() === 9, "Last element of the first 10 numbers!");
        assert.ok(mx(TestContext.arr5).last("t => t < 5") === 4, "Last element less than 5 of the first 10 numbers!");

        assert.throws(function () {
            mx([]).last();
        }, "throws an exception getting last element of an empty collection!");

        assert.throws(function () {
            mx(TestContext.arr5).last("t => t > 100");
        }, "throws an exception getting first element greater than 100 of the first 10 numbers!");
    });


    QUnit.test("lastOrDefault", function (assert) {

        assert.ok(mx(TestContext.arr5).lastOrDefault() === 9, "Last element of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).lastOrDefault("t => t < 5") === 4, "Last element greater than 5 of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).lastOrDefault("t => t > 100") === null, "Last element greater than 100 of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).lastOrDefault("t => t > 100", 100) === 100, "Last element greater than 100 of the first 10 numbers or 100 as default!");
    });


    QUnit.test("max", function (assert) {

        assert.ok(mx(TestContext.arr5).max() === 9, "Maximum of the first 10 numbers!");
        assert.ok(mx(TestContext.arr7).max() === "9_string", "Maximum of the 10 string array!");
        assert.ok(mx(TestContext.arr2).max("t => t.name") === "n9", "Maximum of a complex array by selector!");

        assert.throws(function () {
            mx([]).max();
        }, "throws an exception getting maximum of an empty collection!");
    });


    QUnit.test("min", function (assert) {

        assert.ok(mx(TestContext.arr5).min() === 0, "Minimum of the first 10 numbers!");
        assert.ok(mx(TestContext.arr7).min() === "0_string", "Minimum of the 10 string array!");
        assert.ok(mx(TestContext.arr2).min("t => t.name") === "n0", "Minimum of a complex array by selector!");

        assert.throws(function () {
            mx([]).min();
        }, "throws an exception getting minimum of an empty collection!");
    });


    QUnit.test("ofType", function (assert) {

        assert.ok(mx(TestContext.arr5).ofType(Number).count() === 10, "Cast array of numbers to number!");
        assert.ok(mx(TestContext.arr5).ofType(String).count() === 0, "Cast array of numbers to string!");
    });


    QUnit.test("orderBy", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).orderBy("t => t").take(5).toArray(), [0, 1, 2, 3, 4], "Order array of numbers ascending!");

        assert.ok(mx(TestContext.arr2).orderBy("t => t.name", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().name === "n0", "Order array of complex object ascending with comparer!");

        assert.ok(mx(TestContext.arr2).orderBy("t => t.name").thenByDescending("t => t.inner.index").first().name === "n0", "Order array of complex object by 'name' ascending then by 'inner.index' descending !");

        var _arr = [{ name: "a", val: 1 }, { name: "a", val: 2 }, { name: "b", val: 1 }, { name: "c", val: 2 }];
        var _result = [{ name: "a", val: 1 }, { name: "b", val: 1 }, { name: "a", val: 2 }, { name: "c", val: 2 }];

        assert.deepEqual(mx(_arr).orderBy("t => t.val").thenBy("t => t.name").toArray(), _result, "Order and thenBy!");

    });


    QUnit.test("orderByDescending", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).orderByDescending("t => t").take(5).toArray(), [9, 8, 7, 6, 5], "Order array of numbers descending!");

        assert.ok(mx(TestContext.arr2).orderByDescending("t => t", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().name === "n0", "Order array of complex object descending with comparer!");

        assert.ok(mx(TestContext.arr2).orderByDescending("t => t.name").thenByDescending("t => t.inner.index").first().name === "n9", "Order array of complex object by 'name' descending then by 'inner.index' descending !");

        var _arr = [{ name: "a", val: 1 }, { name: "a", val: 2 }, { name: "b", val: 1 }, { name: "c", val: 2 }];
        var _result = [{ name: "a", val: 2 }, { name: "c", val: 2 }, { name: "a", val: 1 }, { name: "b", val: 1 }];

        assert.deepEqual(mx(_arr).orderByDescending("t => t.val").thenBy("t => t.name").toArray(), _result, "Order descending and thenBy!");

    });


    QUnit.test("reverse", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).reverse().take(5).toArray(), [9, 8, 7, 6, 5], "Reverse array of first 10 numbers!");
        assert.ok(mx(TestContext.arr7).reverse().first() === "9_string", "Reverse array of strings!");
    });


    QUnit.test("sequenceEqual", function (assert) {

        assert.ok(mx(TestContext.arr5).sequenceEqual(mx(TestContext.arr5_clone)), "sequenceEqual on array of numbers!");
        assert.ok(mx([1, 2, 3]).sequenceEqual(mx([1, 2])) === false, "sequenceEqual on inharmonic arrays of numbers!");

        assert.ok(mx([{ name: "a" }]).sequenceEqual(mx([{ name: "a", val: 1 }]), {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }), "sequenceEqual on arrays of objects with comparer!");
    });


    QUnit.test("select", function (assert) {

        assert.ok(mx(TestContext.arr5).select("t => t + 100").first() === 100, "select first 10 numbers plus 100!");
        assert.ok(mx(TestContext.arr5).select("(t, i) => i").last() === 9, "select index while enumerating 10 numbers!");
    });


    QUnit.test("selectMany", function (assert) {

        var _arr = [{ name: "A", values: [1, 2, 3, 4] }, { name: "B", values: [5, 6, 7, 8] }];

        assert.ok(mx(_arr).selectMany("t => t.values").count() === 8, "selectMany on complex objects!");
        assert.deepEqual(mx(_arr).selectMany("t => t.values", "(t, u) => {name:t.name, value:u}").first(), { name: "A", value: 1 }, "selectMany on complex objects with result selector!");
    });


    QUnit.test("single", function (assert) {

        assert.ok(mx([1]).single() === 1, "Single element of a single array!");
        assert.ok(mx(TestContext.arr5).single("t => t === 1") === 1, "Single element equal to 1 of the first 10 numbers!");

        assert.throws(function () {
            mx([]).single();
        }, "throws an exception getting single element of an empty collection!");

        assert.throws(function () {
            mx(TestContext.arr5).single();
        }, "throws an exception getting single element of an collection containing more than one element!");

        assert.throws(function () {
            mx(TestContext.arr5).single("t => t > 100");
        }, "throws an exception getting single element greater than 100 of the first 10 numbers!");

        assert.throws(function () {
            mx(TestContext.arr5).single("t => t < 10");
        }, "throws an exception getting single element less than 10 of the first 10 numbers!");
    });


    QUnit.test("singleOrDefault", function (assert) {

        assert.ok(mx([1]).singleOrDefault() === 1, "Single element of a single array or default!");
        assert.ok(mx([]).singleOrDefault() === null, "Single element of an empty array or default!");

        assert.ok(mx(TestContext.arr5).singleOrDefault("t => t === 1") === 1, "Single element equal to 1 of the first 10 numbers or default!");
        assert.ok(mx(TestContext.arr5).singleOrDefault("t => t === 100", 100) === 100, "Single element of an empty array or default!");

        assert.throws(function () {
            mx(TestContext.arr5).singleOrDefault();
        }, "throws an exception getting single element of an collection containing more than one element!");

        assert.throws(function () {
            mx(TestContext.arr5).singleOrDefault("t => t < 10");
        }, "throws an exception getting single element less than 10 of the first 10 numbers!");
    });


    QUnit.test("skip", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).skip(5).toArray(), [5, 6, 7, 8, 9], "Skip 5 element of a the first 10 numbers!");
        assert.deepEqual(mx(TestContext.arr5).where("t => t % 2 === 0").skip(3).toArray(), [6, 8], "Skip 3 element of a the first 10 even numbers!");
        assert.ok(mx(TestContext.arr5).skip(0).count() === 10, "Skip no items!");
        assert.ok(mx(TestContext.arr5).skip(100).count() === 0, "Skip more than count of the collection!");
    });


    QUnit.test("skipWhile", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).skipWhile("t => t < 5").toArray(), [5, 6, 7, 8, 9], "Skip while elements are less than 5 from the first 10 even numbers!");
        assert.ok(mx(TestContext.arr5).skipWhile("t => t > 5").count() === 10, "Skip while elements are greater than 5 from the first 10 even numbers!");
    });


    QUnit.test("sum", function (assert) {

        assert.ok(mx(TestContext.arr5).sum() === 45, "Sum of the first 10 numbers!");
        assert.ok(mx(TestContext.arr5).sum("t => t * 2") === 90, "Sum of the first 10 numbers multiply by 2!");

        assert.throws(function () {
            mx(TestContext.arr1).sum();
        }, "throws an exception getting sum of non numeric elements!");

        assert.throws(function () {
            mx(TestContext.arr2).sum("t => t.name");
        }, "throws an exception getting sum of non numeric properties!");
    });


    QUnit.test("take", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).take(5).toArray(), [0, 1, 2, 3, 4], "Take 5 element of a the first 10 numbers!");
        assert.deepEqual(mx(TestContext.arr5).where("t => t % 2 === 0").take(3).toArray(), [0, 2, 4], "Take 3 element of a the first 10 even numbers!");
        assert.ok(mx(TestContext.arr5).take(0).count() === 0, "Take no items!");
        assert.ok(mx(TestContext.arr5).take(100).count() === 10, "Take more than count of the collection!");
    });


    QUnit.test("takeWhile", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).takeWhile("t => t < 5").toArray(), [0, 1, 2, 3, 4], "Take while elements are less than 5 from the first 10 even numbers!");
        assert.ok(mx(TestContext.arr5).takeWhile("t => t > 5").count() === 0, "Take while elements are greater than 5 from the first 10 even numbers!");
    });


    QUnit.test("toArray", function (assert) {

        assert.deepEqual(mx(TestContext.arr5).where("t => t < 5").toArray(), [0, 1, 2, 3, 4], "Elements less than 5 from the first 10 even numbers!");
    });


    QUnit.test("toDictionary", function (assert) {

        assert.ok(mx(TestContext.arr2).toDictionary("t => t.name").count() === 10, "toDictionary key-selector!");
        assert.ok(mx(TestContext.arr2).toDictionary("t => t.name", "t => t.inner.index").first().value === 0, "toDictionary key-selector & element-selector!");

        assert.ok(mx(TestContext.arr2).toDictionary("t => t", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().key.name === "n0", "toDictionary key-selector & comparer!");

        assert.ok(mx(TestContext.arr2).toDictionary("t => t", "t => t.inner.index", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().value === 0, "toDictionary key-selector, element-selector & comparer!");

        assert.throws(function () {
            mx([1, 1, 2]).toDictionary("t => t");
        }, "throws an exception with duplicate keys!");
    });


    QUnit.test("toList", function (assert) {

        assert.ok(mx(TestContext.arr5).toList().count() === 10, "toList first 10 numbers!");
        assert.ok(mx(TestContext.arr5).toList()[1] === 1, "toList indexer first 10 numbers!");
    });


    QUnit.test("toLookup", function (assert) {

        assert.ok(mx(TestContext.arr5).toLookup("t => t").count() === 10, "toLookup first 10 numbers!");
        assert.ok(mx(TestContext.arr5).toLookup("t => t").get(1).count() === 1, "toLookup indexer first 10 numbers!");

        assert.ok(mx(TestContext.arr2).toLookup("t => t", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().first().name === "n0", "toLookup with key-selector and comparer!");

        assert.ok(mx(TestContext.arr2).toLookup("t => t", "t => t.name", {
            hash: function (o) { return mx.hash(o.name); },
            equals: function (a, b) { return a.name === b.name; }
        }).first().first() === "n0", "toLookup with key-selector, element-selector and comparer!");
    });


    QUnit.test("union", function (assert) {

        assert.ok(mx(TestContext.arr5).union(TestContext.arr5_clone).count() === 10, "Union first 10 numbers with itself!");
        assert.deepEqual(mx([1, 2]).union(mx([2, 3])).toArray(), [1, 2, 3], "Union two arrays!");
    });


    QUnit.test("where", function (assert) {

        assert.ok(mx(TestContext.arr5).where("t => t < 5").count() === 5, "Filter first 10 numbers less than 10!");
        assert.ok(mx(TestContext.arr2).where("t => t.inner.index < 5").count() === 5, "Filter complex object by value!");
        assert.deepEqual(mx(TestContext.arr5).where("t => t <= 1").toArray(), [0, 1], "Deep equal check!");
    });


    QUnit.test("zip", function (assert) {

        assert.ok(mx([1, 2]).zip([3, 4], "(t, u) => t + u").first() === 4, "Zip two numeric array!");
        assert.ok(mx([1, 2]).zip([3], "(t, u) => t + u").count() === 1, "Zip two inharmonic numeric array!");
    });

})(window);