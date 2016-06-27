import mx from './es6/multiplex/mx.js';
import hash from './es6/runtime/hash';
import equals from './es6/runtime/equals';
import compare from './es6/runtime/compare';

mx.hash = hash;
mx.equals = equals;
mx.compare = compare;

export default mx;
