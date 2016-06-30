import mx from './multiplex/mx';
import hash from './runtime/hash';
import equals from './runtime/equals';
import compare from './runtime/compare';

mx.hash = hash;
mx.equals = equals;
mx.compare = compare;

export default mx;
