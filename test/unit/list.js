/// <reference path="../data/_references.js" />


(function () {

    var List = mx.List;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateList() {
        return new List(1, 2, 3, 4, 5);
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("List");


    QUnit.test("constructor", function (assert) {
        assert.ok(new List().count() === 0, "an empty list!");
        assert.ok(new List(10).count() === 10, "an empty list with initial capacity!");
        assert.ok(new List(1, 2, 3, 4, 5).count() === 5, "list initializer!");
        assert.ok(new List(mx.range(0, 10)).count() === 10, "list from an Enumerable!");
    });


    QUnit.test("indexer", function (assert) {

        var _list = CreateList();

        assert.ok(_list[0] === 1, "indexer get!");

        _list[0] = 0;
        assert.ok(_list[0] === 0 && _list.first() === 0, "indexer set!");
    });


    QUnit.test("add", function (assert) {

        var _list = new List();

        _list.add(1);
        assert.ok(_list[0] === 1, "add!");
        assert.ok(_list.count() === 1, "add count!");
    });


    QUnit.test("addRange", function (assert) {

        var _list = new List();

        _list.addRange(mx.range(0, 10));
        assert.ok(_list.count() === 10, "add range of numbers!");
    });


    QUnit.test("asReadOnly", function (assert) {

        var _rlist = new List(mx.range(0, 10)).asReadOnly();

        assert.ok(_rlist.count() === 10, "readOnlyCollection count!");
        assert.ok(_rlist[0] === 0, "readOnlyCollection get!");

        _rlist[0] = 100;
        assert.ok(_rlist[0] === 0, "readOnlyCollection set!");
    });


    QUnit.test("binarySearch", function (assert) {

        var _list1 = new List(mx.range(0, 100));
        var _list2 = new List(mx.range(0, 100).select("t => { index: t }"));

        assert.ok(_list1.binarySearch(50) === 50, "binary-search to find an item!");
        assert.ok(_list1.binarySearch(100) < 0, "binary-search item not found!");

        assert.ok(_list2.binarySearch({ index: 50 }, {
            compare: function (a, b) {
                return a.index - b.index;
            }
        }) === 50, "binary-search find an item with comparer!");

        assert.ok(_list2.binarySearch({ index: 80 }, 50, 40, {
            compare: function (a, b) {
                return a.index - b.index;
            }
        }) === 80, "binary-search find an item with index, count and comparer!");
    });


    QUnit.test("clear", function (assert) {

        var _list = CreateList();

        _list.clear();
        assert.ok(_list.count() === 0, "Clear list!");
    });


    QUnit.test("contains", function (assert) {

        var _list = CreateList();

        assert.ok(_list.contains(3) === true, "list contains!");
        assert.ok(_list.contains(6) === false, "list not containing!");
    });


    QUnit.test("copyTo", function (assert) {

        var _list = CreateList(),
            _arr = new Array(_list.count());

        _list.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "list copyTo an array!");
    });


    QUnit.test("exists", function (assert) {

        var _list = CreateList();

        assert.ok(_list.exists("t => t % 2 === 0"), "an even number exists in a list of the first 5 number!");
        assert.ok(_list.exists("t => t > 5") === false, "6 exists in a list of the first 5 number!");
    });


    QUnit.test("find", function (assert) {

        var _list = CreateList();

        assert.ok(_list.find("t => t % 2 === 0") === 2, "find an even number in a list of the first 5 number!");
        assert.ok(_list.find("t => t > 5") === null, "find a number greater than 5 in a list of the first 5 number!");
    });


    QUnit.test("findIndex", function (assert) {

        var _list = CreateList();

        assert.ok(_list.findIndex("t => t % 2 === 0") === 1, "find index of an even numbers in a list of the first 5 number!");
        assert.ok(_list.findIndex(2, "t => t % 2 === 0") === 3, "find index of an even numbers in a list of the first 5 number, starting from 2!");
        assert.ok(_list.findIndex(2, 1, "t => t % 2 === 0") === -1, "find index of an even numbers in a list of the first 5 number, starting from 3, for 1 attempt!");
    });


    QUnit.test("findLast", function (assert) {

        var _list = CreateList();

        assert.ok(_list.findLast("t => t % 2 === 0") === 4, "find last even number in a list of the first 5 number!");
        assert.ok(_list.findLast("t => t > 5") === null, "find last number greater than 5 in a list of the first 5 number!");
    });


    QUnit.test("findLastIndex", function (assert) {

        var _list = new List(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);

        assert.ok(_list.findLastIndex("t => t % 2 === 0") === 8, "find last index of an even numbers in a list of the first 10 number!");
        assert.ok(_list.findLastIndex(5, "t => t % 2 === 0") === 4, "find last index of an even numbers in a list of the first 10 number, starting from 5!");
        assert.ok(_list.findLastIndex(5, 1, "t => t % 2 === 0") === -1, "find last index of an even numbers in a list of the first 10 number, starting from 5, for 1 attempt!");
    });


    QUnit.test("forEach", function (assert) {

        var _list = CreateList(),
            _count = 0;

        _list.forEach(function (t) { _count += t; });

        assert.ok(_count === 15, "forEach to get sum of a the items in a list!");
    });


    QUnit.test("get", function (assert) {

        var _list = CreateList();

        assert.ok(_list.get(1) === 2, "get item at index 1 from a list of 5 numbers!");
        assert.throws(function () {
            _list.get(10);
        }, "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("getRange", function (assert) {

        var _list = CreateList();

        assert.deepEqual(_list.getRange(0, 3).toArray(), [1, 2, 3], "get range of first 3 items of a list of first 5 numbers!");
        assert.throws(function () {
            _list.getRange(0, 10);
        }, "throws an error getting first 10 items from a list of 5 numbers!");
    });


    QUnit.test("indexOf", function (assert) {

        var _list = CreateList();

        assert.ok(_list.indexOf(3) === 2, "get index of 3 in a list of first 5 numbers!");
        assert.ok(_list.indexOf(10) === -1, "get index of 10 in a list of first 5 numbers!");
        assert.ok(_list.indexOf(3, 4) === -1, "get index of 3 in a list of first 5 numbers, starting from index 4!");
    });


    QUnit.test("insert", function (assert) {

        var _list = CreateList();

        _list.insert(3, 0);

        assert.ok(_list.count() === 6, "insert an item in a list of 5 numbers, get count!");
        assert.ok(_list[3] === 0, "insert an item in a list of 5 numbers, get item!");
        assert.throws(function () {
            _list.insert(10, 0);
        }, "throws an error inserting in 10th index of a list of 5 numbers!");
    });


    QUnit.test("insertRange", function (assert) {

        var _list = CreateList();

        _list.insertRange(3, mx.range(0, 3));

        assert.ok(_list.count() === 8, "insert range of items in a list of 5 numbers, get count!");
        assert.ok(_list[3] === 0 && _list[4] === 1 && _list[5] === 2, "insert range of items in a list of 5 numbers, get items!");
        assert.throws(function () {
            _list.insertRange(10, mx.range(0, 3));
        }, "throws an error inserting range of items in 10th index of a list of 5 numbers!");
    });


    QUnit.test("lastIndexOf", function (assert) {

        var _list = CreateList();

        assert.ok(_list.lastIndexOf(3) === 2, "get last index of 3 in a list of first 5 numbers!");
        assert.ok(_list.lastIndexOf(10) === -1, "get last index of 10 in a list of first 5 numbers!");
        assert.ok(_list.lastIndexOf(3, 1) === -1, "get last index of 3 in a list of first 5 numbers, starting from index 1!");
    });


    QUnit.test("remove", function (assert) {

        var _list = CreateList();

        assert.ok(_list.remove(2) === true && _list.count() === 4, "remove an item from a list, get count!");
        assert.ok(_list.remove(10) === false && _list.count() === 4, "remove an item which does not exist in a list, get count!");
    });


    QUnit.test("removeAll", function (assert) {

        var _list = CreateList();

        assert.ok(_list.removeAll("t => t % 2 === 0") === 2 && _list.count() === 3, "remove all even numbers from a list of first 5 numbers, get count!");
        assert.ok(_list.removeAll("t => t % 2 === 0") === 0 && _list.count() === 3, "remove all even numbers from a list of first 3 odd numbers, get count!");
    });


    QUnit.test("removeAt", function (assert) {

        var _list = CreateList();

        _list.removeAt(2);

        assert.ok(_list[2] === 4 && _list.count() === 4, "remove item from 2nd index of a list of first 5 numbers, get count!");
        assert.throws(function () {
            _list.removeAt(10);
        }, "throws an error removing item from 10th index of a list of first 5 numbers!");
    });


    QUnit.test("removeRange", function (assert) {

        var _list = CreateList();

        _list.removeRange(1, 3);

        assert.ok(_list[0] === 1 && _list[1] === 5 && _list.count() === 2, "remove range of 3 items, starting from 1st index from a list of first 5 numbers, get count!");
        assert.throws(function () {
            _list.removeRange(10, 10);
        }, "throws an error removing a range of items starting from 10th index of a list of first 5 numbers!");
    });


    QUnit.test("reverse", function (assert) {

        var _arr = [1, 2, 3, 4, 5],
            _list1 = new List(_arr),
            _list2 = new List(_arr);

        _list1.reverse();
        _list2.reverse(0, 3);

        assert.deepEqual(_list1.toArray(), [5, 4, 3, 2, 1], "reverse list of 5 first numbers!");
        assert.deepEqual(_list2.toArray(), [3, 2, 1, 4, 5], "reverse first 3 items of a list of 5 first numbers!");
    });


    QUnit.test("set", function (assert) {

        var _list = CreateList();

        _list.set(1, 0);

        assert.ok(_list[1] === 0, "set value at index 1 of a list!");
        assert.throws(function () {
            _list.set(10, 1);
        }, "throws an error setting item at index 10 from a list of 5 numbers!");
    });


    QUnit.test("sort", function (assert) {

        var _arr = [7, 1, 8, 3, 2, 0, 9, 6, 4, 5],
            _list1 = new List(_arr),
            _list2 = new List(_arr),
            _list3 = new List(_arr),
            _list4 = new List(_arr),
            _sorter = function (a, b) { return a - b; };

        _list1.sort();
        _list2.sort(_sorter);
        _list3.sort({ compare: _sorter });
        _list4.sort(0, 5, { compare: _sorter });

        assert.deepEqual(_list1.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "sort list of first 10 numbers!");
        assert.deepEqual(_list2.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "sort list of first 10 numbers with a comparison function!");
        assert.deepEqual(_list3.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "sort list of first 10 numbers with a comparer!");
        assert.deepEqual(_list4.toArray(), [1, 2, 3, 7, 8, 0, 9, 6, 4, 5], "sort 5 first items of list of first 10 numbers with a comparer!");
    });


    QUnit.test("toArray", function (assert) {

        var _list = CreateList();

        assert.deepEqual(_list.toArray(), [1, 2, 3, 4, 5], "converts a list of numbers to an array!");
    });


    QUnit.test("trueForAll", function (assert) {

        var _list = CreateList();

        assert.ok(_list.trueForAll("t => t < 10") === true, "checks whether all items in a list of 5 first numbers are less than 10!");
        assert.ok(_list.trueForAll("t => t < 3") === false, "checks whether all items in a list of 5 first numbers are less than 3!");
    });


    QUnit.test("list enumerable", function (assert) {

        var _list = CreateList();

        assert.deepEqual(_list.select("t => t * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a list!");
    });
})();