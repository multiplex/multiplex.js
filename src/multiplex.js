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

import Collection from './lib/collections/collection';
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

mx.Iterable = Iterable;
mx.Iterator = Iterator;
mx.Collection = Collection;

export default mx;
