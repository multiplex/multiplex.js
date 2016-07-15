import Iterator from './iteration/iterator';
import Iterable from './iteration/iterable';
import iteratorSymbol from './iteration/iterator-symbol';

import {
    hash,
    hashSymbol,
    equals,
    equalsSymbol,
    compare,
    compareSymbol
} from './runtime/runtime';


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
