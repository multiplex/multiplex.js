import mx from './lib/multiplex/mx';
import hash from './lib/runtime/hash';
import equals from './lib/runtime/equals';
import compare from './lib/runtime/compare';

mx.hash = hash;
mx.equals = equals;
mx.compare = compare;

export default mx;
