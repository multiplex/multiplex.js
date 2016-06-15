/// <reference path="../data/_references.js" />


(function () {
    "use strict";

    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateLookup() {
        return mx([1, 1, 2, 3, 3, 4, 4, 4]).toLookup("t => t");
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Lookup");


    QUnit.test("contains", function (assert) {

        var _lookup = CreateLookup();

        assert.ok(_lookup.contains(1) === true, "lookup contains an item!");
        assert.ok(_lookup.contains(10) === false, "lookup does not an item!");
    });


    QUnit.test("count", function (assert) {

        var _lookup = CreateLookup();

        assert.ok(_lookup.count() === 4, "lookup count!");
    });


    QUnit.test("get", function (assert) {

        var _lookup = CreateLookup();

        assert.ok(_lookup.get(1).count() === 2, "lookup get an item!");
        assert.ok(_lookup.get(10).count() === 0, "lookup get non existing item!");
    });


    QUnit.test("lookup enumerable", function (assert) {

        var _lookup = CreateLookup();

        assert.deepEqual(_lookup.select("t => t.key").toArray(), [1, 2, 3, 4], "lookup select keys, to array!");
        assert.deepEqual(_lookup.selectMany("t => t").toArray(), [1, 1, 2, 3, 3, 4, 4, 4], "lookup select all items, to array!");
        assert.deepEqual(_lookup.select("t => t.count()").toArray(), [2, 1, 2, 3], "lookup select items count!");
    });

})();
