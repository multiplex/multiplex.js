import mx from './lib/multiplex/mx';
import Iterable from './lib/multiplex/iterable';
import Iterator from './lib/multiplex/iterator';
import iteratorSymbol from './lib/multiplex/iterator-symbol';

import {
    hash,
    hashSymbol,
    equals,
    equalsSymbol,
    compare,
    compareSymbol
} from './lib/runtime/runtime';


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
