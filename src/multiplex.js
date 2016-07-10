import mx from './lib/multiplex/mx';
import Iterator from './lib/multiplex/iterator';
import Multiplex from './lib/multiplex/multiplex';
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

mx.Iterator = Iterator;
mx.Multiplex = Multiplex;


export default mx;
