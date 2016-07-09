import hash from './hash';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

const __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
const __objectHashMap = new WeakMap();
let __objectHashIndex = __objectHashSeed;


export default function compute31BitObjecHash(obj) {
    let _hash = __objectHashMap.get(obj);

    // hash not found in the repositoty
    if (_hash === undefined) {
        // create object-literals hash based on their visible properties
        if (isObjectLiteral(obj)) {
            _hash = __objectHashSeed;

            // early seed prevents mutually recursive structures to stack overflow
            __objectHashMap.set(obj, 0);

            // only object literals fall into following code, no need to check for hasOwnProperty
            for (let _p in obj) {
                _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
            }
        }
        else {
            _hash = __objectHashIndex++ >> 32;
        }

        // assign the hash value until the lifetime of the object
        __objectHashMap.set(obj, _hash);
    }

    return _hash;
}
