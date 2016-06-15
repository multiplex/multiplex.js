/// <reference path="../data/_references.js" />


(function () {
    "use strict";

    var List = mx.List,
        ReadOnlyCollection = mx.ReadOnlyCollection;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateCollection() {
        return new ReadOnlyCollection(new List(1, 2, 3, 4, 5));
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("ReadOnlyCollection");


    QUnit.test("constructor", function (assert) {
        assert.ok(CreateCollection().count() === 5, "initialize a ReadOnlyCollection!");

        assert.throws(function () {
            new ReadOnlyCollection();
        }, "throws an exception creating an ampty ReadOnlyCollection!");

        assert.throws(function () {
            new ReadOnlyCollection(mx.range(0, 10));
        }, "throws an exception creating a ReadOnlyCollection without a list!");
    });


    QUnit.test("indexer", function (assert) {

        var _col = CreateCollection();

        assert.ok(_col[0] === 1, "indexer get!");

        assert.ok(function () {
            try { _col[0] = 0; }
            catch (e) { }
            return _col[0] === 1;
        }, "indexer set!");

        assert.ok(function () {
            try { _col[10] = 0; }
            catch (e) { }
            return _col[10] === undefined;
        }, "out of range indexer set!");
    });


    QUnit.test("get", function (assert) {

        var _col = CreateCollection();

        assert.ok(_col.get(1) === 2, "get item at index 1 from a collection of 5 numbers!");
        assert.throws(function () {
            _col.get(10);
        }, "throws error getting item at index 10 from a collection of 5 numbers!");
    });


    QUnit.test("contains", function (assert) {

        var _col = CreateCollection();

        assert.ok(_col.contains(3) === true, "collection contains!");
        assert.ok(_col.contains(6) === false, "collection not containing!");
    });


    QUnit.test("copyTo", function (assert) {

        var _col = CreateCollection(),
            _arr = new Array(_col.count());

        _col.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "collection copyTo an array!");
        assert.throws(function () {
            _col.copyTo([], 0);
        }, "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("indexOf", function (assert) {

        var _col = CreateCollection();

        assert.ok(_col.indexOf(3) === 2, "get index of 3 in a collection of first 5 numbers!");
        assert.ok(_col.indexOf(10) === -1, "get index of 10 in a collection of first 5 numbers!");
    });


    QUnit.test("collection enumerable", function (assert) {

        var _col = CreateCollection();
        assert.deepEqual(_col.select("t => t * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a collection!");
    });


})();
