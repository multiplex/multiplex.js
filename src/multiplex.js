import Iterator from './lib/iteration/iterator';
import Iterable from './lib/iteration/iterable';
import $iterable from './lib/iteration/iterable-factory';

import runtime, {
    runtimeHash,
    runtimeEquals,
    runtimeCompare
} from './lib/runtime/runtime';

import Comparer from './lib/collections/comparer';
import EqualityComparer from './lib/collections/equality-comparer';
import Collection from './lib/collections/collection';
import ReadOnlyCollection from './lib/collections/read-only-collection';
import Dictionary from './lib/collections/dictionary';
import KeyValuePair from './lib/collections/key-value-pair';
import List from './lib/collections/list';
import LinkedList from './lib/collections/linked-list';
import LinkedListNode from './lib/collections/linked-list-node';
import Lookup from './lib/collections/lookup';
import HashSet from './lib/collections/hash-set';
import Map from './lib/collections/map';
import Set from './lib/collections/set';
import Queue from './lib/collections/queue';
import Stack from './lib/collections/stack';
import SortedList from './lib/collections/sorted-list';
import linq from './lib/linq/_linq';

linq(Iterable);


/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} value An Iterable object.
* @returns {Iterable}
*/
function mx(value) {
    return $iterable(value);
}



mx.runtime = runtime;
mx.hash = runtimeHash;
mx.equals = runtimeEquals;
mx.compare = runtimeCompare;

mx.empty = Iterable.empty;
mx.range = Iterable.range;
mx.repeat = Iterable.repeat;

mx.Iterable = Iterable;
mx.Iterator = Iterator;
mx.Comparer = Comparer;
mx.EqualityComparer = EqualityComparer;
mx.Collection = Collection;
mx.ReadOnlyCollection = ReadOnlyCollection;
mx.Dictionary = Dictionary;
mx.KeyValuePair = KeyValuePair;
mx.List = List;
mx.LinkedList = LinkedList;
mx.LinkedListNode = LinkedListNode;
mx.Lookup = Lookup;
mx.HashSet = HashSet;
mx.Map = Map;
mx.Set = Set;
mx.Queue = Queue;
mx.Stack = Stack;
mx.SortedList = SortedList;

export default mx;
