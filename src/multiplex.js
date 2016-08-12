import Iterator from './lib/iteration/iterator';
import Iterable from './lib/iteration/iterable';
import factory from './lib/iteration/iterable-factory';

import runtime, {
    computeHash,
    computeEquals,
    computeCompare
} from './lib/runtime/runtime';

import Comparer from './lib/collections/comparer';
import EqualityComparer from './lib/collections/equality-comparer';
import Collection from './lib/collections/collection';
import Lookup from './lib/collections/lookup';
import Map from './lib/collections/map';
import Set from './lib/collections/set';
import linq from './lib/linq/_linq';

linq(Iterable);


/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} value An Iterable object.
* @returns {Iterable}
*/
function mx(value) {
    return factory(value);
}



mx.runtime = runtime;
mx.hash = computeHash;
mx.equals = computeEquals;
mx.compare = computeCompare;

mx.empty = Iterable.empty;
mx.range = Iterable.range;
mx.repeat = Iterable.repeat;

mx.Iterable = Iterable;
mx.Iterator = Iterator;
mx.Comparer = Comparer;
mx.EqualityComparer = EqualityComparer;
mx.Collection = Collection;
mx.Lookup = Lookup;
mx.Map = Map;
mx.Set = Set;

export default mx;
