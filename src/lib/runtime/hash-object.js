import hash from './hash';
import hashSymbol from './hash-symbol';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

var __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
var __objectHashIndex = __objectHashSeed;
var compute31BitObjecHash;

if (typeof WeakMap === 'function') {
    var __objectHashMap = new WeakMap();

    // using Weakmap as 'hash' repository when possible
    compute31BitObjecHash = function (obj) {
        var _hash = __objectHashMap.get(obj);

        if (_hash === undefined) {
            // create object-literals hash based on their visible properties
            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;

                // early seed prevents mutually recursive structures to stack overflow
                __objectHashMap.set(obj, 0);

                // only object literals fall into following code, no need to check for hasOwnProperty
                for (var _p in obj) {
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
    };
}
else {
    compute31BitObjecHash = function (obj) {
        var _hash = 0;
        var _extensible = Object.isExtensible && Object.isExtensible(obj);

        // only override 'hash' method when object is extensible (not sealed or frozen)
        if (_extensible) {
            // create object-literals hash based on their visible properties
            obj[hashSymbol] = function () {
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
            // return constant hash codes for non-extensible class instances
            _hash = _extensible ? __objectHashIndex++ >> 32 : __objectHashSeed;
        }

        return _hash;
    };
}

export {compute31BitObjecHash as default};

