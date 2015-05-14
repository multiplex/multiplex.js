module MxTests {


    function CreateDictionary(): Dictionary<number, string> {
        var dic = new Dictionary<number, string>();
        dic.add(1, "A");
        dic.add(2, "B");
        dic.add(3, "C");
        dic.add(4, "D");
        dic.add(5, "E");

        return dic;
    }


    QUnit.module("Dictionary");


    QUnit.test("constructor", function (assert) {

        var _comparer = EqualityComparer.create(o => mx.hash(o), (a, b) => a === b),
            _d1 = new Dictionary<number, string>(),
            _d2 = new Dictionary<number, string>(CreateDictionary()),
            _d3 = new Dictionary<number, string>(_comparer),
            _d4 = new Dictionary<number, string>(5),
            _d5 = new Dictionary<number, string>(5, _comparer),
            _d6 = new Dictionary<number, string>(CreateDictionary(), _comparer);


        assert.ok(_d1.count() === 0, "initialize a Dictionary!");
        assert.ok(_d2.count() === 5, "initialize a Dictionary using specified dictionary!");
        assert.ok(_d3.count() === 0, "initialize a Dictionary using specified comparer!");
        assert.ok(_d4.count() === 0, "initialize a Dictionary using initial capacity!");
        assert.ok(_d5.count() === 0, "initialize a Dictionary using using initial capacity and comparer!");
        assert.ok(_d6.count() === 5, "initialize a Dictionary using specified dictionary and comparer!");
    });


    QUnit.test("add", function (assert) {
        var _dic = new Dictionary<number, string>();
        _dic.add(1, "A");

        assert.ok(_dic.count() === 1, "ditionary add");
        assert.throws(() => _dic.add(1, "B"), "throws an error adding duplicate key");
    });


    QUnit.test("clear", function (assert) {
        var _dic = CreateDictionary();
        _dic.clear();

        assert.ok(_dic.count() === 0, "ditionary clear!");
    });


    QUnit.test("containsKey", function (assert) {

        var _dic = CreateDictionary();

        assert.ok(_dic.containsKey(1) === true, "dictionary contains key!");
        assert.ok(_dic.containsKey(10) === false, "dictionary does not contain key!");
    });


    QUnit.test("containsValue", function (assert) {

        var _dic = CreateDictionary();

        assert.ok(_dic.containsValue("A") === true, "dictionary contains value!");
        assert.ok(_dic.containsValue("Z") === false, "dictionary does not contain value!");
    });


    QUnit.test("copyTo", function (assert) {

        var _dic = CreateDictionary(),
            _arr = new Array(_dic.count());

        _dic.copyTo(_arr, 0);
        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "dictionary copy to an array!");
        assert.throws(() => _dic.copyTo([], 0), "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("keys", function (assert) {

        var _dic = CreateDictionary();

        assert.deepEqual(_dic.keys(), [1, 2, 3, 4, 5], "dictionary keys!");
        assert.deepEqual(new Dictionary().keys(), [], "empty dictionary keys!");
    });


    QUnit.test("values", function (assert) {

        var _dic = CreateDictionary();

        assert.deepEqual(_dic.values(), ["A", "B", "C", "D", "E"], "dictionary values!");
        assert.deepEqual(new Dictionary().values(), [], "empty dictionary values!");
    });


    QUnit.test("get", function (assert) {

        var _dic = CreateDictionary();

        assert.ok(_dic.get(1) === "A", "dictionary get value!");
        assert.throws(() => _dic.get(10), "throws an error getting non existing key!");
    });


    QUnit.test("set", function (assert) {

        var _dic = CreateDictionary();
        
        _dic.set(1, "AA");
        assert.ok(_dic.get(1) === "AA", "dictionary set value!");

        _dic.set(6, "F");
        assert.ok(_dic.count() === 6 && _dic.get(6) === "F", "dictionary set new key and value!");
    });


    QUnit.test("tryGetValue", function (assert) {

        var _dic = CreateDictionary();

        assert.ok(function () {
            var value: string;
            var res = _dic.tryGetValue(1, val => value = val);

            return res && value === "A";

        }, "dictionary tryGetValue, exisiting key!");


        assert.ok(function () {
            var value: string;
            var res = _dic.tryGetValue(10, val => value = val);

            return res === false;

        }, "dictionary tryGetValue, invalid key!");
    });


    QUnit.test("remove", function (assert) {

        var _dic = CreateDictionary();

        assert.ok(_dic.remove(1) === true && _dic.count() === 4, "dictionary remove key!");
        assert.ok(_dic.remove(10) === false && _dic.count() === 4, "dictionary remove non existing key!");
    });


    QUnit.test("key-value pair", function (assert) {

        var _pair1 = new KeyValuePair(1, "A"),
            _pair2 = new KeyValuePair(1, "A");

        assert.ok(_pair1.key === 1 && _pair1.value === "A", "KeyValuePair get key/value!");

        _pair1.key = 2;
        _pair1.value = "B";
        assert.ok(_pair1.key === 1 && _pair1.value === "A", "KeyValuePair key/value immutable!");

        assert.ok(mx.hash(_pair1) === mx.hash(_pair2), "KeyValuePair get hash code!");
        assert.ok(mx.equals(_pair1, _pair2), "KeyValuePair equality check!");
    });


    QUnit.test("dictionary enumerable", function (assert) {

        var _dic = CreateDictionary();

        assert.deepEqual(_dic.select(t => t.key).toArray(), [1, 2, 3, 4, 5], "dictionary select keys, to array!");
        assert.deepEqual(_dic.select(t => t.value).toArray(), ["A", "B", "C", "D", "E"], "dictionary select values, to array!");
        assert.ok(_dic.toArray().first().key === 1 && _dic.toArray().first().value === "A", "dictionary select key-value items!");
    });
}