import hash from './hash';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

const __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
const __objectHashMap = new WeakMap();
let __objetHashIndex = __objectHashSeed;


export default function compute31BitObjecHash(obj) {
    let _hash = __objectHashMap.get(obj);

    if (_hash == null) {
        if (isObjectLiteral(obj)) {
            _hash = __objectHashSeed;
            __objectHashMap.set(obj, 0);           // prevents recursion

            // only object literals fall into following code, no need to check for hasOwnProperty

            for (let _p in obj) {
                _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
            }
        }
        else {
            _hash = __objetHashIndex++ >> 32;
        }

        __objectHashMap.set(obj, _hash);
    }

    return _hash;
}
