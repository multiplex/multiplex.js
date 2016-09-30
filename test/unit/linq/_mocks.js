import mx from '../../multiplex';

var arr = [1, 2, 3, 4, 5];
var collection = new mx.Collection(arr);
var list = new mx.List(arr);
var linkedList = new mx.LinkedList(arr);
var hashSet = new mx.HashSet(arr);
var stack = new mx.Stack(arr);
var queue = new mx.Queue(arr);
var set = new mx.Set(arr);
var map = new mx.Map();
var dictionary = new mx.Dictionary();
var sortedList = new mx.SortedList();
var readOnlyCollection = list.asReadOnly();
var lookup = new mx.Lookup(arr, function (t) {
    return t;
});

for (var i = 0; i < arr.length; i++) {
    map.set(arr[i], arr[i]);
    dictionary.set(arr[i], arr[i]);
    sortedList.add(arr[i], arr[i]);
}

export {
    collection,
    list,
    linkedList,
    hashSet,
    stack,
    queue,
    set,
    map,
    dictionary,
    lookup,
    readOnlyCollection,
    sortedList
};