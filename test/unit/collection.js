/// <reference path="../data/_references.js" />


(function () {
    "use strict";

    var Collection = mx.Collection;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateCollection() {
        return new Collection(mx.range(1, 5));
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Collection");


    QUnit.test("constructor", function (assert) {

        assert.ok(CreateCollection().count() === 5, "initialize a Collection using specified collection!");
    });


    QUnit.test("count", function (assert) {

        var _col = CreateCollection();
        assert.ok(_col.count() === 5, "collection containing count!");
        assert.throws(function () {
            new Collection().count();
        }, "throws an error getting count of an empty collection.");
    });


    QUnit.test("copyTo", function (assert) {

        var _col = CreateCollection(),
            _arr = new Array(_col.count());

        _col.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "Collection copy to an array!");
        assert.throws(function () {
            _col.copyTo([], 0);
        }, "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("collection enumerable", function (assert) {

        var _col = CreateCollection();
        assert.deepEqual(_col.select("t => t * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a collection!");
    });

})();
