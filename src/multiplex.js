import Iterable from './lib/iteration/iterable';
import Iterator from './lib/iteration/iterator';
import factory from './lib/iteration/iterable-factory';

import {
    hash,
    hashSymbol,
    equals,
    equalsSymbol,
    compare,
    compareSymbol
} from './lib/runtime/runtime';

import Comparer from './lib/collections/comparer';
import EqualityComparer from './lib/collections/equality-comparer';
import Collection from './lib/collections/collection';
import Lookup from './lib/collections/lookup';
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



mx.hash = hash;
mx.hashSymbol = hashSymbol;
mx.equals = equals;
mx.equalsSymbol = equalsSymbol;
mx.compare = compare;
mx.compareSymbol = compareSymbol;
mx.iteratorSymbol = Symbol.iterator;

mx.empty = Iterable.empty;
mx.range = Iterable.range;
mx.repeat = Iterable.repeat;

mx.Iterable = Iterable;
mx.Iterator = Iterator;
mx.Comparer = Comparer;
mx.EqualityComparer = EqualityComparer;
mx.Collection = Collection;
mx.Lookup = Lookup;

export default mx;
