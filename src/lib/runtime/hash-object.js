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

    compute31BitObjecHash = function (obj) {
        var _hash = __objectHashMap.get(obj);

        if (_hash == null) {
            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;
                __objectHashMap.set(obj, 0);           // prevents recursion

                // only object literals fall into following code, no need to check for hasOwnProperty

                for (var _p in obj) {
                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
                }
            }
            else {
                _hash = __objetHashIndex++ >> 32;
            }

            __objectHashMap.set(obj, _hash);
            return _hash;
        }
    };
}
else {
    compute31BitObjecHash = function (obj) {
        var _hash = 0;

        if (typeof obj[hashSymbol] !== 'function') {
            var _frozon = Object.isFrozen && Object.isFrozen(obj);

            if (!_frozon) {
                obj[hashSymbol] = function () {            // prevents recursion
                    return _hash;
                };
            }

            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;

                // only object literals fall into following code, no need to check for hasOwnProperty

                for (var _p in obj) {
                    if (_p === hashSymbol) {
                        continue;
                    }

                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
                }
            }
            else {
                _hash = _frozon ? __objectHashSeed : __objetHashIndex++ >> 32;
            }
        }

        return _hash;
    };
}

export {compute31BitObjecHash as default};

