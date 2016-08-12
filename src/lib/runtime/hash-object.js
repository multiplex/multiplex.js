import hash from './hash';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

const OBJECT_HASH_SEED = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
const OBJECT_HASH_MAP = new WeakMap();
let OBJECT_HASH_INDEX = OBJECT_HASH_SEED;


export default function compute31BitObjecHash(obj, strict) {
    let h = OBJECT_HASH_MAP.get(obj);

    // hash not found in the repositoty
    if (h === undefined) {
        // create object-literals hash based on their visible properties in non-strict mode
        if (strict !== true && isObjectLiteral(obj)) {
            h = OBJECT_HASH_SEED;

            // early seed prevents mutually recursive structures to stack overflow
            OBJECT_HASH_MAP.set(obj, 0);

            // only object literals fall into following code, no need to check for hasOwnProperty
            let prop;
            for (prop in obj) {
                h = combineHash(h, compute31BitStringHash(prop) + hash(obj[prop]));
            }
        }
        else {
            h = OBJECT_HASH_INDEX++ >> 32;
        }

        // assign the hash value until the lifetime of the object
        OBJECT_HASH_MAP.set(obj, h);
    }

    return h;
}
