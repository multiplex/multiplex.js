/// <reference path="../data/_references.js" />


(function () {

    var SortedList = mx.SortedList,
        Dictionary = mx.Dictionary,
        Comparer = mx.Comparer,
        NumericComparer = Comparer.create(function (a, b) {
            return a - b;
        });


    function CreateDictionary() {
        var dic = new Dictionary();
        dic.add(1, "A");
        dic.add(2, "B");
        dic.add(3, "C");
        dic.add(4, "D");
        dic.add(5, "E");

        return dic;
    }


    function CreateSortedList() {
        var list = new SortedList();
        list.add(5, "E");
        list.add(3, "C");
        list.add(2, "B");
        list.add(4, "D");
        list.add(1, "A");

        return list;
    }


    QUnit.module("SortedList");


    QUnit.test("constructor", function (assert) {

        var _dic = CreateDictionary(),
            _s1 = new SortedList(),
            _s2 = new SortedList(5),
            _s3 = new SortedList(_dic),
            _s4 = new SortedList(NumericComparer),
            _s5 = new SortedList(5, NumericComparer),
            _s6 = new SortedList(_dic, NumericComparer);


        assert.ok(_s1.count() === 0 && _s1.capacity() === 0, "initialize a SortedList!");
        assert.ok(_s2.count() === 0 && _s2.capacity() === 5, "initialize a SortedList using initial capacity!");
        assert.ok(_s3.count() === 5 && _s3.capacity() === 5, "initialize a SortedList using specified dictionary!");
        assert.ok(_s4.count() === 0 && _s4.capacity() === 0, "initialize a SortedList using specified comparer!");
        assert.ok(_s5.count() === 0 && _s5.capacity() === 5, "initialize a SortedList using using initial capacity and comparer!");
        assert.ok(_s6.count() === 5 && _s6.capacity() === 5, "initialize a SortedList using specified dictionary and comparer!");
    });


    QUnit.test("add", function (assert) {

        assert.ok(CreateSortedList().count() == 5, "sorted-list add!");
        assert.throws(function () {
            var _list = CreateSortedList();
            _list.add(1, "AA");
        }, "throws an error adding existing key to the list!");
    });


    QUnit.test("get", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.get(1) === "A", "sorted-list get!");
        assert.throws(function () {
            _list.get(10);
        }, "throws an error getting invalid key!");
    });


    QUnit.test("capacity", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.capacity() > 0, "get sorted-list capacity!");

        _list.capacity(10);
        assert.ok(_list.capacity() === 10, "set sorted-list capacity!");
    });


    QUnit.test("clear", function (assert) {

        var _list = CreateSortedList();
        _list.clear();

        assert.ok(_list.count() === 0 && _list.capacity() === 0, "clear sorted-list!");
    });


    QUnit.test("comparer", function (assert) {

        var comparer = CreateSortedList().comparer();

        assert.ok(comparer.compare(5, 1) > 0 && comparer.compare(1, 5) < 0 && comparer.compare(1, 1) === 0, "sorted-list comparer!");
    });


    QUnit.test("containsKey", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.containsKey(1) === true, "sorted-list contains key!");
        assert.ok(_list.containsKey(10) === false, "sorted-list does not contain key!");

        _list = new SortedList({
            compare: function (a, b) { return a.name.localeCompare(b.name); }
        });

        _list.add({ id: 2, name: "B" }, 2);
        _list.add({ id: 5, name: "E" }, 5);
        _list.add({ id: 4, name: "D" }, 4);
        _list.add({ id: 3, name: "C" }, 3);
        _list.add({ id: 1, name: "A" }, 1);

        assert.ok(_list.containsKey({ id: 3, name: "C" }), "sorted-list contains key using specified comparer");
    });


    QUnit.test("containsValue", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.containsValue("A") === true, "sorted-list contains value!");
        assert.ok(_list.containsValue("Z") === false, "sorted-list does not contain value!");
    });


    QUnit.test("keys", function (assert) {

        var _list = CreateSortedList();

        assert.deepEqual(_list.keys(), [1, 2, 3, 4, 5], "sorted-list keys!");
        assert.deepEqual(new SortedList().keys(), [], "empty sorted-list keys!");
    });


    QUnit.test("values", function (assert) {

        var _list = CreateSortedList();

        assert.deepEqual(_list.values(), ["A", "B", "C", "D", "E"], "sorted-list values!");
        assert.deepEqual(new SortedList().values(), [], "empty sorted-list values!");
    });


    QUnit.test("indexOfKey", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.indexOfKey(1) === 0, "sorted-list index of key!");
        assert.ok(_list.indexOfKey(10) < 0, "sorted-list index of invalid key!");
    });


    QUnit.test("indexOfValue", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.indexOfValue("A") === 0, "sorted-list index of value!");
        assert.ok(_list.indexOfValue("Z") < 0, "sorted-list index of invalid value!");
    });


    QUnit.test("remove", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.remove(1) === true && _list.count() === 4 && _list.indexOfKey(1) < 0, "sorted-list remove key!");
        assert.ok(_list.remove(1) === false && _list.count() === 4, "sorted-list remove invalid key!");
    });


    QUnit.test("removeAt", function (assert) {

        var _list = CreateSortedList();
        _list.removeAt(0);

        assert.ok(_list.count() === 4 && _list.indexOfKey(1) < 0, "sorted-list remove at index!");
        assert.throws(function () {
            _list.removeAt(10);
        }, "throws an error removing item at invalid index");
    });


    QUnit.test("set", function (assert) {

        var _list = CreateSortedList();

        _list.set(1, "AA");
        assert.ok(_list.count() === 5 && _list.get(1) === "AA", "sorted-list set exisiting key's value!");

        _list.set(6, "F");
        assert.ok(_list.count() === 6 && _list.get(6) === "F", "sorted-list set new key and value!");
    });


    QUnit.test("tryGetValue", function (assert) {

        var _list = CreateSortedList();

        assert.ok(function () {
            var value;

            var res = _list.tryGetValue(1, function (val) {
                value = val;
            });

            return res && value === "A";

        }, "sorted-list tryGetValue, exisiting key!");


        assert.ok(function () {
            var value;

            var res = _list.tryGetValue(10, function (val) {
                value = val;
            });

            return res === false;

        }, "sorted-list tryGetValue, invalid key!");
    });


    QUnit.test("sorted-list enumerable", function (assert) {

        var _list = CreateSortedList();

        assert.deepEqual(_list.select("t => t.key * 2").where("t => t > 5").toArray(), [6, 8, 10], "select-where-toArray over a sorted-list!");
        assert.deepEqual(_list.where("t => t.key > 2").select("t => t.value").toArray(), ["C", "D", "E"], "where-select-toArray over a sorted-list!");
    });


    QUnit.test("evaluate sorting", function (assert) {

        var list = CreateSortedList();

        list.remove(5);
        list.add(6, "F");
        list.remove(4);
        list.add(7, "G");
        list.remove(3);
        list.add(8, "H");
        list.remove(2);
        list.add(9, "I");
        list.remove(1);
        list.add(10, "J");

        assert.deepEqual(list.keys(), [6, 7, 8, 9, 10], "evaluate sorted keys after multiple add/remove");
        assert.deepEqual(list.values(), ["F", "G", "H", "I", "J"], "evaluate sorted values after multiple add/remove");



        list = new SortedList({
            compare: function (a, b) { return a.name.localeCompare(b.name); }
        });

        list.add({ id: 2, name: "B" }, 2);
        list.add({ id: 5, name: "E" }, 5);
        list.add({ id: 4, name: "D" }, 4);
        list.add({ id: 3, name: "C" }, 3);
        list.add({ id: 1, name: "A" }, 1);

        assert.deepEqual(list.keys().select("t => t.id").toArray(), [1, 2, 3, 4, 5], "evaluate sorted keys after multiple add/remove using specified comparer!");
    });

})(window);
