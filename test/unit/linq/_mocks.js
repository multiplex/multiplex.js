import mx from '../../multiplex';

var array = [1, 2, 3, 4, 5];
var enumerable = mx.range(1, 5);
var collection = new mx.Collection(array);
var list = new mx.List(array);
var linkedList = new mx.LinkedList(array);
var hashSet = new mx.HashSet(array);
var stack = new mx.Stack(array);
var queue = new mx.Queue(array);
var set = new mx.Set(array);
var map = new mx.Map();
var dictionary = new mx.Dictionary();
var sortedList = new mx.SortedList();
var readOnlyCollection = list.asReadOnly();
var lookup = new mx.Lookup(array, function (t) {
    return t;
});

for (var i = 0; i < array.length; i++) {
    map.set(array[i], array[i]);
    dictionary.set(array[i], array[i]);
    sortedList.add(array[i], array[i]);
}

function Basic(val, name) {
    this.val = val;
    this.name = name;
}

Basic.prototype.__hash__ = function () {
    return this.val;
};

Basic.prototype.__eq__ = function (obj) {
    return this.val === obj.val && this.name === obj.name;
};


export {
    array,
    enumerable,
    collection,
    list,
    readOnlyCollection,
    linkedList,
    hashSet,
    stack,
    queue,
    set,
    map,
    dictionary,
    lookup,
    sortedList,
    Basic
};