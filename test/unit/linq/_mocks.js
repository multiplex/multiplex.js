import mx from '../../multiplex';

var arr = [1, 2, 3, 4, 5];
var collection = new mx.Collection(arr);
var list = new mx.List(arr);
var linkedList = new mx.LinkedList(arr);
var hashSet = new mx.HashSet(arr);
var stack = new mx.Stack(arr);
var queue = new mx.Queue(arr);
var set = new mx.Set(arr);

var map = new mx.Map(mx(arr).select(function (t) {
    return [t, t];
}));

var dictionary = mx(arr).toDictionary(function (t) {
    return t;
});

var lookup = mx(arr).toLookup(function (t) {
    return t;
});

var readOnlyCollection = list.asReadOnly();
var sortedList = new mx.SortedList(dictionary);

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
