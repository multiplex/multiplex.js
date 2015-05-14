module MxTests {


    function CreateDictionary(): Dictionary<number, string> {
        var _dic = new Dictionary<number, string>();
        _dic.add(1, "A");
        _dic.add(2, "B");
        _dic.add(3, "C");
        _dic.add(4, "D");
        _dic.add(5, "E");

        return _dic;
    }


    function CreateSortedList(): SortedList<number, string> {
        var _list = new SortedList<number, string>();
        _list.add(5, "E");
        _list.add(3, "C");
        _list.add(2, "B");
        _list.add(4, "D");
        _list.add(1, "A");

        return _list;
    }


    QUnit.module("SortedList");


    QUnit.test("constructor", function (assert) {

        var _comparer = Comparer.create((a: number, b: number) => a - b),
            _dic = CreateDictionary(),
            _s1 = new SortedList(),
            _s2 = new SortedList(5),
            _s3 = new SortedList(_dic),
            _s4 = new SortedList(_comparer),
            _s5 = new SortedList(5, _comparer),
            _s6 = new SortedList(_dic, _comparer);


        assert.ok(_s1.count() === 0 && _s1.capacity() === 0, "initialize a SortedList!");
        assert.ok(_s2.count() === 0 && _s2.capacity() === 5, "initialize a SortedList using initial capacity!");
        assert.ok(_s3.count() === 5 && _s3.capacity() === 5, "initialize a SortedList using specified dictionary!");
        assert.ok(_s4.count() === 0 && _s4.capacity() === 0, "initialize a SortedList using specified comparer!");
        assert.ok(_s5.count() === 0 && _s5.capacity() === 5, "initialize a SortedList using using initial capacity and comparer!");
        assert.ok(_s6.count() === 5 && _s6.capacity() === 5, "initialize a SortedList using specified dictionary and comparer!");
    });


    QUnit.test("add", function (assert) {

        assert.ok(CreateSortedList().count() == 5, "sorted-list add!");
        assert.throws(() => CreateSortedList().add(1, "AA"), "throws an error adding existing key to the list!");
    });


    QUnit.test("get", function (assert) {

        var _list = CreateSortedList();

        assert.ok(_list.get(1) === "A", "sorted-list get!");
        assert.throws(() => _list.get(10), "throws an error getting invalid key!");
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

        var _comparer = CreateSortedList().comparer();

        assert.ok(_comparer.compare(5, 1) > 0 && _comparer.compare(1, 5) < 0 && _comparer.compare(1, 1) === 0, "sorted-list comparer!");
    });


    QUnit.test("containsKey", function (assert) {

        var _list1 = CreateSortedList(),
            _list2 = new SortedList<{ id: number; name: string }, number>({ compare: (a, b) => a.name.localeCompare(b.name) });

        assert.ok(_list1.containsKey(1) === true, "sorted-list contains key!");
        assert.ok(_list1.containsKey(10) === false, "sorted-list does not contain key!");


        _list2.add({ id: 2, name: "B" }, 2);
        _list2.add({ id: 5, name: "E" }, 5);
        _list2.add({ id: 4, name: "D" }, 4);
        _list2.add({ id: 3, name: "C" }, 3);
        _list2.add({ id: 1, name: "A" }, 1);

        assert.ok(_list2.containsKey({ id: 3, name: "C" }), "sorted-list contains key using specified comparer");
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
        assert.throws(() => _list.removeAt(10), "throws an error removing item at invalid index");
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
            var value: string;
            var res = _list.tryGetValue(1, val => value = val);

            return res && value === "A";

        }, "sorted-list tryGetValue, exisiting key!");


        assert.ok(function () {
            var value: string;
            var res = _list.tryGetValue(10, val => value = val);

            return res === false;

        }, "sorted-list tryGetValue, invalid key!");
    });


    QUnit.test("sorted-list enumerable", function (assert) {

        var _list = CreateSortedList();

        assert.deepEqual(_list.select(t => t.key * 2).where(t => t > 5).toArray(), [6, 8, 10], "select-where-toArray over a sorted-list!");
        assert.deepEqual(_list.where(t => t.key > 2).select(t => t.value).toArray(), ["C", "D", "E"], "where-select-toArray over a sorted-list!");
    });


    QUnit.test("evaluate sorting", function (assert) {

        var _list1 = CreateSortedList(),
            _list2 = new SortedList<{ id: number; name: string }, number>({ compare: (a, b) => a.name.localeCompare(b.name) });

        _list1.remove(5);
        _list1.add(6, "F");
        _list1.remove(4);
        _list1.add(7, "G");
        _list1.remove(3);
        _list1.add(8, "H");
        _list1.remove(2);
        _list1.add(9, "I");
        _list1.remove(1);
        _list1.add(10, "J");

        assert.deepEqual(_list1.keys(), [6, 7, 8, 9, 10], "evaluate sorted keys after multiple add/remove");
        assert.deepEqual(_list1.values(), ["F", "G", "H", "I", "J"], "evaluate sorted values after multiple add/remove");



        _list2.add({ id: 2, name: "B" }, 2);
        _list2.add({ id: 5, name: "E" }, 5);
        _list2.add({ id: 4, name: "D" }, 4);
        _list2.add({ id: 3, name: "C" }, 3);
        _list2.add({ id: 1, name: "A" }, 1);

        assert.deepEqual(_list2.keys().select(t => t.id).toArray(), [1, 2, 3, 4, 5], "evaluate sorted keys after multiple add/remove using specified comparer!");
    });
}