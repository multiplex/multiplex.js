/// <reference path="../data/_references.js" />


(function () {
    "use strict";

    var Stack = mx.Stack;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateStack() {
        return new Stack(mx.range(1, 5));
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("Stack");


    QUnit.test("constructor", function (assert) {

        assert.ok(new Stack().count() === 0, "initialize an empty Stack!");
        assert.ok(CreateStack().count() === 5, "initialize a Stack using specified collection!");
    });


    QUnit.test("clear", function (assert) {

        var _stack = CreateStack();
        _stack.clear();
        assert.ok(_stack.count() === 0, "clears a Stack!");
    });


    QUnit.test("contains", function (assert) {

        var _stack = CreateStack();
        assert.ok(_stack.contains(1) === true, "stack containing an item!");
        assert.ok(_stack.contains(10) === false, "stack does not contain an item!");
    });


    QUnit.test("copyTo", function (assert) {

        var _stack = CreateStack(),
            _arr = new Array(_stack.count());

        _stack.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "stack copy to an array!");
        assert.throws(function () {
            _stack.copyTo([], 0);
        }, "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("peek", function (assert) {

        var _stack = CreateStack();
        assert.ok(_stack.peek() === 5, "stack peek an item!");

        _stack.clear();
        assert.throws(function () {
            _stack.peek();
        }, "throws an error peek from empty stack!");
    });


    QUnit.test("pop", function (assert) {

        var _stack = CreateStack();
        assert.ok(_stack.pop() === 5, "stack pop an item!");

        _stack.clear();
        assert.throws(function () {
            _stack.pop();
        }, "throws an error pop from empty stack!");
    });


    QUnit.test("push", function (assert) {

        var _stack = CreateStack();
        _stack.push(6);

        assert.ok(_stack.count() === 6 && _stack.peek() === 6, "stack push an item!");
    });


    QUnit.test("toArray", function (assert) {

        var _stack = CreateStack();
        assert.deepEqual(_stack.toArray(), [1, 2, 3, 4, 5], "stack to array!");
    });


    QUnit.test("stack enumerable", function (assert) {

        var _stack = CreateStack();
        assert.deepEqual(_stack.select("t => t * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a stack!");
    });

})();
