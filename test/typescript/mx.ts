module MxTests {

    import Enumerator = mx.Enumerator;
    import Enumerable = mx.Enumerable;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function MxCount(source: Enumerable<any>): number {
        var _e = source.getEnumerator(),
            _i = 0;

        while (_e.next()) {
            _i++;
        }

        return _i;
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Multiplex");


    QUnit.test("Multiplex Array", function (assert) {

        var _source = mx([1, 2, 3, 4]);
        assert.ok(MxCount(_source) === 4, "Passed!");
    });


    QUnit.test("Multiplex String", function (assert) {
        var _source = mx("Multiplex");
        assert.ok(MxCount(_source) === 9, "Passed!");
    });


    QUnit.test("Multiplex Object", function (assert) {
        var _source = mx({ name: "mx", id: 1 });
        assert.ok(MxCount(_source) === 2, "Passed!");
    });


    QUnit.test("Multiplex Array-like", function (assert) {
        var _source = mx(arguments);
        assert.ok(MxCount(_source) === 1, "Passed!");
    });


    //QUnit.test("Multiplex Iterable", function (assert) {
    //    var _set = new Set(),
    //        _source = mx(_set);
        
    //    _set.add(1);
    //    _set.add(2);
    //    _set.add(3);
    //    assert.ok(MxCount(_source) === 3, "Passed!");
    //});


    QUnit.test("Multiplex Custom Enumerator", function (assert) {
        var _source = mx({
            getEnumerator: function (): Enumerator<number> {
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
                };
            }
        });
        assert.ok(MxCount(_source) === 3, "Passed!");
    });


    QUnit.test("Multiplex Generator", function (assert) {
        try {
            var _source = eval("mx(function* () { yield 1; yield 2; yield 3; })");
            assert.ok(MxCount(_source) === 3, "Passed!");
        }
        catch (e) { assert.ok(true, "Generator not implemented by the browser"); }
    });


    QUnit.test("Multiplex Legacy Generator", function (assert) {
        var _source = mx(function () {
            var count = 3, 
                index = 0;

            return new Enumerator(function (yielder) {
                if (index++ < count) {
                    yielder(index);
                }
            });
        });
        assert.ok(MxCount(_source) === 3, "Passed!");
    });


    QUnit.test("mx.range", function (assert) {
        var _source = mx.range(0, 4);
        assert.deepEqual(_source.toArray(), [0, 1, 2, 3], "Passed!");
    });


    QUnit.test("mx.repeat", function (assert) {
        var _source = mx.repeat(1, 4);
        assert.deepEqual(_source.toArray(), [1, 1, 1, 1], "Passed!");
    });


    QUnit.test("mx.empty", function (assert) {
        var _source = mx.empty();
        assert.ok(MxCount(_source) === 0, "Passed!");
    });


    QUnit.test("mx.is", function (assert) {
        assert.ok(mx.is(mx.range(1, 10)), "Enumerable Passed!");
        assert.ok(mx.is([1]), "Array Passed!");
        assert.ok(mx.is("mx"), "String Passed!");
        //assert.ok(mx.is(new Set()), "Iterable Passed!");

        assert.ok(mx.is({
            getEnumerator: function (): Enumerator<number> {
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
                };
            }
        }), "Custom Enumerator Passed!");

        try {
            assert.ok(mx.is(eval("mx(function* () { yield 1; yield 2; yield 3; })")), "Generator Passed!");
        }
        catch (e) { assert.ok(true, "Generator not implemented by the browser"); }
    });
}