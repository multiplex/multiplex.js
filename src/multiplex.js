import Iterator from './lib/iteration/iterator';
import Iterable from './lib/iteration/iterable';
import iteratorSymbol from './lib/iteration/iterator-symbol';

import {
    hash,
    hashSymbol,
    equals,
    equalsSymbol,
    compare,
    compareSymbol
} from './lib/runtime/runtime';

import linq from './lib/linq/_linq';

linq(Iterable);


/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} value An Iterable object.
* @returns {Iterable}
*/
function mx(value) {
    return value instanceof Iterable ? value : new Iterable(value);
}



mx.hash = hash;
mx.hashSymbol = hashSymbol;
mx.equals = equals;
mx.equalsSymbol = equalsSymbol;
mx.compare = compare;
mx.compareSymbol = compareSymbol;
mx.iteratorSymbol = iteratorSymbol;

mx.Iterable = Iterable;
mx.Iterator = Iterator;

export default mx;
