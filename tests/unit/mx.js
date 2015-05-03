/// <reference path="../data/_references.js" />

(function () {

    /**
    * Returns the number of elements in a sequence.
    * @param {Enumerable} source An enumerable object.
    * @returns {Number}
    */
    function MxCount(source) {
        var _e = source.getEnumerator(),
            _i = 0;

        while (_e.next()) {
            _i++;
        }

        return _i;
    }



    QUnit.test("Multiplex Array", function (assert) {
        var _source = mx([1, 2, 3, 4]);
        assert.ok(MxCount(_source) == 4, "Passed!");
    });


    QUnit.test("Multiplex String", function (assert) {
        var _source = mx("Multiplex");
        assert.ok(MxCount(_source) == 9, "Passed!");
    });


    QUnit.test("Multiplex Object", function (assert) {
        var _source = mx({ name: "mx", id: 1 });
        assert.ok(MxCount(_source) == 2, "Passed!");
    });


    QUnit.test("Multiplex Array-like", function (assert) {
        var _source = mx(document.querySelectorAll("#qunit"));
        assert.ok(MxCount(_source) == 1, "Passed!");
    });


    QUnit.test("Multiplex Iterable", function (assert) {
        var _source = mx(new Set([1, 2, 3]));
        assert.ok(MxCount(_source) == 3, "Passed!");
    });


    QUnit.test("Multiplex Custom Enumerator", function (assert) {
        var _source = mx({
            getEnumerator: function () {
                var count = 3, index = 0;
                return {
                    current: undefined,
                    next: function () {
                        if (index++ < count) {
                            this.current = index;
                            return true;
                        }
                        else {
                            this.current = undefined;
                            return false;
                        }
                    }
                }
            }
        });
        assert.ok(MxCount(_source) == 3, "Passed!");
    });


    QUnit.test("Multiplex Generator", function (assert) {
        var _source = eval("mx(function* () { yield 1; yield 2; yield 3; })");
        assert.ok(MxCount(_source) == 3, "Passed!");
    });


    QUnit.test("Multiplex Legacy Generator", function (assert) {
        var _source = mx(function () {
            var count = 3, index = 0;
            return new Enumerator(function (yielder) {
                if (index++ < count)
                    yielder(index);
            });
        });
        assert.ok(MxCount(_source) == 3, "Passed!");
    });


    QUnit.test("Enumerable.range", function (assert) {
        var _source = Enumerable.range(0, 4);
        assert.deepEqual(_source.toArray(), [0, 1, 2, 3], "Passed!");
    });


    QUnit.test("Enumerable.repeat", function (assert) {
        var _source = Enumerable.repeat(1, 4);
        assert.deepEqual(_source.toArray(), [1, 1, 1, 1], "Passed!");
    });


    QUnit.test("Enumerable.empty", function (assert) {
        var _source = Enumerable.empty();
        assert.ok(MxCount(_source) == 0, "Passed!");
    });


    QUnit.test("Enumerable.is", function (assert) {
        assert.ok(Enumerable.is(Enumerable.range(1, 10)), "Enumerable Passed!");
        assert.ok(Enumerable.is([1]), "Array Passed!");
        assert.ok(Enumerable.is("mx"), "String Passed!");
        assert.ok(Enumerable.is(new Set([1, 2, 3])), "Iterable Passed!");
        assert.ok(Enumerable.is({
            getEnumerator: function () {
                var count = 3, index = 0;
                return {
                    current: undefined,
                    next: function () {
                        if (index++ < count) {
                            this.current = index;
                            return true;
                        }
                        else {
                            this.current = undefined;
                            return false;
                        }
                    }
                }
            }
        }), "Custom Enumerator Passed!");
        assert.ok(Enumerable.is(eval("mx(function* () { yield 1; yield 2; yield 3; })")), "Generator Passed!");
    });
})();