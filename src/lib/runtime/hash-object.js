import hash from './hash';
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
                // Josh Bloch hash method
                _hash = (17 * 31 + _hash) * 31 + compute31BitStringHash(_p) + hash(obj[_p]);
            }

            _hash = _hash & 0X7FFFFFFF;
        }
        else {
            _hash = __objetHashIndex++ >> 32;
        }

        __objectHashMap.set(obj, _hash);
    }

    return _hash;
}
