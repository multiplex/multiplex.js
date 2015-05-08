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

        var dic = CreateDictionary(),
            s1 = new SortedList(),
            s2 = new SortedList(5),
            s3 = new SortedList(dic),
            s4 = new SortedList(NumericComparer),
            s5 = new SortedList(5, NumericComparer),
            s6 = new SortedList(dic, NumericComparer);


        assert.ok(s1.count() === 0 && s1.capacity() === 0, "initialize a SortedList!");
        assert.ok(s2.count() === 0 && s2.capacity() === 5, "initialize a SortedList using initial capacity!");
        assert.ok(s3.count() === 5 && s3.capacity() === 5, "initialize a SortedList using specified dictionary!");
        assert.ok(s4.count() === 0 && s4.capacity() === 0, "initialize a SortedList using specified comparer!");
        assert.ok(s5.count() === 0 && s5.capacity() === 5, "initialize a SortedList using using initial capacity and comparer!");
        assert.ok(s6.count() === 5 && s6.capacity() === 5, "initialize a SortedList using specified dictionary and comparer!");
    });


    QUnit.test("add", function (assert) {

        assert.ok(CreateSortedList().count() == 5, "sorted-list add!");
        assert.throws(function () {
            var list = CreateSortedList();
            list.add(1, "AA");
        }, "throws an error adding existing key to the list!");
    });


    QUnit.test("get", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.get(1) === "A", "sorted-list get!");
        assert.throws(function () {
            list.get(10);
        }, "throws an error getting invalid key!");
    });


    QUnit.test("capacity", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.capacity() > 0, "get sorted-list capacity!");

        list.capacity(10);
        assert.ok(list.capacity() === 10, "set sorted-list capacity!");
    });


    QUnit.test("clear", function (assert) {

        var list = CreateSortedList();
        list.clear();

        assert.ok(list.count() === 0 && list.capacity() === 0, "clear sorted-list!");
    });


    QUnit.test("comparer", function (assert) {

        var comparer = CreateSortedList().comparer();

        assert.ok(comparer.compare(5, 1) > 0 && comparer.compare(1, 5) < 0 && comparer.compare(1, 1) === 0, "sorted-list comparer!");
    });


    QUnit.test("containsKey", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.containsKey(1) === true, "sorted-list contains key!");
        assert.ok(list.containsKey(10) === false, "sorted-list does not contain key!");

        list = new SortedList({
            compare: function (a, b) { return a.name.localeCompare(b.name); }
        });

        list.add({ id: 2, name: "B" }, 2);
        list.add({ id: 5, name: "E" }, 5);
        list.add({ id: 4, name: "D" }, 4);
        list.add({ id: 3, name: "C" }, 3);
        list.add({ id: 1, name: "A" }, 1);

        assert.ok(list.containsKey({ id: 3, name: "C" }), "sorted-list contains key using specified comparer");
    });


    QUnit.test("containsValue", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.containsValue("A") === true, "sorted-list contains value!");
        assert.ok(list.containsValue("Z") === false, "sorted-list does not contain value!");
    });


    QUnit.test("keys", function (assert) {

        var list = CreateSortedList();

        assert.deepEqual(list.keys(), [1, 2, 3, 4, 5], "sorted-list keys!");
        assert.deepEqual(new SortedList().keys(), [], "empty sorted-list keys!");
    });


    QUnit.test("values", function (assert) {

        var list = CreateSortedList();

        assert.deepEqual(list.values(), ["A", "B", "C", "D", "E"], "sorted-list values!");
        assert.deepEqual(new SortedList().values(), [], "empty sorted-list values!");
    });


    QUnit.test("indexOfKey", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.indexOfKey(1) === 0, "sorted-list index of key!");
        assert.ok(list.indexOfKey(10) < 0, "sorted-list index of invalid key!");
    });


    QUnit.test("indexOfValue", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.indexOfValue("A") === 0, "sorted-list index of value!");
        assert.ok(list.indexOfValue("Z") < 0, "sorted-list index of invalid value!");
    });


    QUnit.test("remove", function (assert) {

        var list = CreateSortedList();

        assert.ok(list.remove(1) === true && list.count() === 4 && list.indexOfKey(1) < 0, "sorted-list remove key!");
        assert.ok(list.remove(1) === false && list.count() === 4, "sorted-list remove invalid key!");
    });


    QUnit.test("removeAt", function (assert) {

        var list = CreateSortedList();
        list.removeAt(0);

        assert.ok(list.count() === 4 && list.indexOfKey(1) < 0, "sorted-list remove at index!");
        assert.throws(function () {
            list.removeAt(10);
        }, "throws an error removing item at invalid index");
    });


    QUnit.test("set", function (assert) {

        var list = CreateSortedList();

        list.set(1, "AA");
        assert.ok(list.count() === 5 && list.get(1) === "AA", "sorted-list set exisiting key's value!");

        list.set(6, "F");
        assert.ok(list.count() === 6 && list.get(6) === "F", "sorted-list set new key and value!");
    });


    QUnit.test("tryGetValue", function (assert) {

        var list = CreateSortedList();

        assert.ok(function () {
            var value;

            var res = list.tryGetValue(1, function (val) {
                value = val;
            });

            return res && value === "A";

        }, "sorted-list tryGetValue, exisiting key!");


        assert.ok(function () {
            var value;

            var res = list.tryGetValue(10, function (val) {
                value = val;
            });

            return res === false;

        }, "sorted-list tryGetValue, invalid key!");
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
