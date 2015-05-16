/// <reference path="../data/_references.js" />


(function () {

    var LinkedList = mx.LinkedList,
        LinkedListNode = mx.LinkedListNode;



    /* Factory methods
    ---------------------------------------------------------------------- */

    function CreateLinkedList() {
        return new LinkedList(mx.range(1, 5));
    }



    /* Tests
    ---------------------------------------------------------------------- */

    QUnit.module("LinkedList");


    QUnit.test("constructor", function (assert) {

        assert.ok(new LinkedList().count() === 0, "initialize an empty LinkedList!");
        assert.ok(CreateLinkedList().count() === 5, "initialize a LinkedList using specified collection!");
    });


    QUnit.test("add", function (assert) {

        var _list = CreateLinkedList();
        _list.add(6);

        assert.ok(_list.count() === 6, "add an item to a LinkedList!");
    });


    QUnit.test("clear", function (assert) {

        var _list = CreateLinkedList();
        _list.clear();

        assert.ok(_list.count() === 0, "clear a LinkedList!");
    });


    QUnit.test("contains", function (assert) {

        var _list = CreateLinkedList();

        assert.ok(_list.contains(1) && _list.contains(5), "LinkedList contains an item!");
        assert.ok(_list.contains(10) === false, "LinkedList does not contains an item!");
    });


    QUnit.test("copyTo", function (assert) {

        var _list = CreateLinkedList(),
            _arr = new Array(_list.count());

        _list.copyTo(_arr, 0);

        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "LinkedList copy to an array!");
        assert.throws(function () {
            _list.copyTo([], 0);
        }, "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("getFirst", function (assert) {

        var _list = CreateLinkedList();

        assert.ok(_list.getFirst().value() === 1, "LinkedList first item!");
        assert.ok(new LinkedList().getFirst() === null, "empty LinkedList first item!");
    });


    QUnit.test("getLast", function (assert) {

        var _list = CreateLinkedList();

        assert.ok(_list.getLast().value() === 5, "LinkedList last item!");
        assert.ok(new LinkedList().getLast() === null, "empty LinkedList last item!");
    });


    QUnit.test("addAfter", function (assert) {

        var _list = CreateLinkedList(),
            _first = _list.getFirst(),
            _node = new LinkedListNode(6);

        _list.addAfter(_first, _node);
        _list.addAfter(_first, 7);

        assert.ok(_list.count() === 7, "LinkedList add after item, get count!");
        assert.ok(_list.contains(6) && _list.contains(7), "LinkedList add after item, check contains!");
    });


    QUnit.test("addBefore", function (assert) {

        var _list = CreateLinkedList(),
            _last = _list.getLast(),
            _node = new LinkedListNode(6);

        _list.addBefore(_last, _node);
        _list.addBefore(_last, 7);

        assert.ok(_list.count() === 7, "LinkedList add before item, get count!");
        assert.ok(_list.contains(6) && _list.contains(7), "LinkedList add before item, check contains!");
    });


    QUnit.test("addFirst", function (assert) {

        var _list = CreateLinkedList(),
            _node = new LinkedListNode(0);

        _list.addFirst(_node);
        _list.addFirst(-1);

        assert.ok(_list.count() === 7, "LinkedList add first, get count!");
        assert.ok(_list.contains(0) && _list.contains(-1), "LinkedList add first, check contains!");
        assert.ok(_list.getFirst().value() === -1, "LinkedList add first, get first!");
    });


    QUnit.test("addLast", function (assert) {

        var _list = CreateLinkedList(),
            _node = new LinkedListNode(6);

        _list.addLast(_node);
        _list.addLast(7);

        assert.ok(_list.count() === 7, "LinkedList add last, get count!");
        assert.ok(_list.contains(6) && _list.contains(7), "LinkedList add last, check contains!");
        assert.ok(_list.getLast().value() === 7, "LinkedList add last, get last!");
    });


    QUnit.test("find", function (assert) {

        var _list = CreateLinkedList();

        assert.ok(_list.find(4).value() === 4, "LinkedList find an item!");
        assert.ok(_list.find(10) === null, "LinkedList does not find an item!");
    });


    QUnit.test("findLast", function (assert) {

        var _list = CreateLinkedList(),
            _node = new LinkedListNode(1);

        _list.addLast(_node);

        assert.ok(_list.findLast(1) === _node, "LinkedList find last!");
        assert.ok(_list.findLast(10) === null, "LinkedList does not find last item!");
    });


    QUnit.test("remove", function (assert) {

        var _list = CreateLinkedList(),
            _last = _list.getLast();

        assert.ok(_list.remove(1) === true, "LinkedList remove an item!");
        assert.ok(_list.remove(1) === false, "LinkedList remove non existing item!");
        assert.ok(_list.remove(_last) === true, "LinkedList remove a node!");
        assert.throws(function () {
            _list.remove(_last);
        }, "throws an error when removing non existing or invalid node!");

        assert.ok(_list.count() === 3, "LinkedList remove, get count!");
    });


    QUnit.test("removeFirst", function (assert) {

        var _list = CreateLinkedList();

        _list.removeFirst();

        assert.ok(_list.count() === 4 && _list.contains(1) === false, "LinkedList remove first node!");
        assert.throws(function () {
            new LinkedList().removeFirst();
        }, "throws an error removing from an empty linked list!");
    });


    QUnit.test("removeLast", function (assert) {

        var _list = CreateLinkedList();

        _list.removeLast();

        assert.ok(_list.count() === 4 && _list.contains(5) === false, "LinkedList remove last node!");
        assert.throws(function () {
            new LinkedList().removeLast();
        }, "throws an error removing from an empty linked list!");
    });


    QUnit.test("linked-list enumerable", function (assert) {

        var _list = CreateLinkedList();
        assert.deepEqual(_list.select("t => t * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a linked-list!");
    });

})(window);
