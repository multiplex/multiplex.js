import mx from './lib/multiplex/mx';

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


export default mx;
