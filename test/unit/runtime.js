/// <reference path="../data/_references.js" />


(function () {

    var EqualityComparer = mx.EqualityComparer;



    /* Classes
    ---------------------------------------------------------------------- */

    // class without equality-comparer
    function SimpleClass() {
    }


    // class overriding '__hash__' and '__equals__' methods.
    function SimpleClassWithComparer(val) {
        this.value = val;
        this.name = val.toString();

        this.__hash__ = function () {
            return mx.hash(this.value, this.name);
        };

        this.__equals__ = function (obj) {
            return obj instanceof SimpleClassWithComparer && obj.value === this.value && obj.name === this.name;
        };
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Runtime");


    QUnit.test("hash", function (assert) {

        assert.ok(mx.hash(null) === 0, "hash null!");
        assert.ok(mx.hash(undefined) === 0, "hash undefined!");
        assert.ok(mx.hash(10) === mx.hash(10), "hash integer number!");
        assert.ok(mx.hash(10.5) === mx.hash(10.5), "hash float number!");
        assert.ok(mx.hash("string") === mx.hash("string"), "hash string!");
        assert.ok(mx.hash(true) === mx.hash(true), "hash boolean!");
        assert.ok(mx.hash(new Date(2015, 0, 1)) === mx.hash(new Date(2015, 0, 1)), "hash date!");
        assert.ok(mx.hash({ name: "A" }) === mx.hash({ name: "A" }), "hash object literal!");
        assert.ok(mx.hash(new SimpleClass()) !== mx.hash(new SimpleClass()), "hash class instance!");
        assert.ok(mx.hash(new SimpleClassWithComparer(10)) === mx.hash(new SimpleClassWithComparer(10)), "hash class instance overriding __hash__ method!");
        assert.ok(mx.hash(10, 10.5, "string", new Date(2015, 0, 1)) === mx.hash(10, 10.5, "string", new Date(2015, 0, 1)), "combine hash codes!");
    });


    QUnit.test("equals", function (assert) {

        assert.ok(mx.equals(null, null) === true, "equals null!");
        assert.ok(mx.equals(undefined, undefined) === true, "equals undefined!");
        assert.ok(mx.equals(10, 10), "equals integer number!");
        assert.ok(mx.equals(10.5, 10.5), "equals float number!");
        assert.ok(mx.equals("string", "string"), "equals string!");
        assert.ok(mx.equals(true, true), "equals boolean!");
        assert.ok(mx.equals(new Date(2015, 0, 1), new Date(2015, 0, 1)), "equals date!");
        assert.ok(mx.equals({ name: "A" }, { name: "A" }), "equals object literal!");
        assert.ok(mx.equals(new SimpleClass(), new SimpleClass()) === false, "equals class instance!");
        assert.ok(mx.equals(new SimpleClass(), new SimpleClass(), EqualityComparer.create(
            function () { return 0; },
            function () { return true; }
        )), "equals class instance using comparer!");
        assert.ok(mx.equals(new SimpleClassWithComparer(10), new SimpleClassWithComparer(10)), "equals class instance overriding __equals__ method!");
    });


    QUnit.test("compare", function (assert) {

        assert.ok(mx.compare(1, null) === 1 && mx.compare(null, 1) === -1 && mx.compare(null, null) === 0, "compare null!");
        assert.ok(mx.compare(1, 0) === 1 && mx.compare(0, 1) === -1 && mx.compare(1, 1) === 0, "compare numbers!");
        assert.ok(mx.compare("B", "A") === 1 && mx.compare("A", "B") === -1 && mx.compare("A", "A") === 0, "compare string!");
        assert.ok(mx.compare(true, false) === 1 && mx.compare(false, true) === -1 && mx.compare(true, true) === 0, "compare bolean!");
        assert.ok(mx.compare(new Date(2015, 0, 2), new Date(2015, 0, 1)) === 1 && mx.compare(new Date(2015, 0, 1), new Date(2015, 0, 2)) === -1 && mx.compare(new Date(2015, 0, 1), new Date(2015, 0, 1)) === 0, "compare date!");
        assert.ok(mx.compare({ name: "A" }, { name: "B" }) === 0, "compare objects!");
    });


    QUnit.test("lambda", function (assert) {

        var _f1 = mx.runtime.lambda("t => t * t"),
            _f2 = mx.runtime.lambda("(t, u) => t + u"),
            _f3 = mx.runtime.lambda("(t, u, r) => t + u + r"),
            _f4 = mx.runtime.lambda("(t, u) => {id:t, name:u}");

        assert.ok(_f1(2) === 4, "square root lambda!");
        assert.ok(_f2(1, 2) === 3, "sum of 2 numbers lambda!");
        assert.ok(_f3(1, 2, 3) === 6, "sum of 3 numbers lambda!");
        assert.ok(_f4(1, "A").id === 1 && _f4(1, "A").name === "A", "object literal lambda!");
    });

})();