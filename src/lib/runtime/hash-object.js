import hash from './hash';
import hashSymbol from './hash-symbol';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

var __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
var __objetHashIndex = __objectHashSeed;
var compute31BitObjecHash;

if (typeof WeakMap === 'function') {
    var __objectHashMap = new WeakMap();

    compute31BitObjecHash = function (val) {
        var _hash = __objectHashMap.get(val);

        if (_hash == null) {
            if (isObjectLiteral(val)) {
                _hash = __objectHashSeed;
                __objectHashMap.set(val, 0);           // prevents recursion

                // only object literals fall into following code, no need to check for hasOwnProperty

                for (var _p in val) {
                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(val[_p]));
                }
            }
            else {
                _hash = __objetHashIndex++ >> 32;
            }

            __objectHashMap.set(val, _hash);
            return _hash;
        }
    };
}
else {
    compute31BitObjecHash = function (val) {
        var _hash = 0;

        if (typeof val[hashSymbol] !== 'function') {
            val[hashSymbol] = function () {            // prevents recursion
                return _hash;
            };

            if (isObjectLiteral(val)) {
                _hash = __objectHashSeed;

                // only object literals fall into following code, no need to check for hasOwnProperty

                for (var _p in val) {
                    if (_p === hashSymbol) {
                        continue;
                    }

                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(val[_p]));
                }
            }
            else {
                _hash = __objetHashIndex++ >> 32;
            }
        }

        return _hash;
    };
}

export {compute31BitObjecHash as default};

