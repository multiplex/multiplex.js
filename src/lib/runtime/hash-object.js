import hash from './hash';
import hashSymbol from './hash-symbol';
import combineHash from './hash-combine';
import compute31BitStringHash from './hash-string';
import isObjectLiteral from '../utils/is-object-literal';

var OBJECT_HASH_SEED = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
var OBJECT_HASH_INDEX = OBJECT_HASH_SEED;
var compute31BitObjecHash;

if (typeof WeakMap === 'function') {
    var OBJECT_HASH_MAP = new WeakMap();

    // using Weakmap as 'hash' repository when possible
    compute31BitObjecHash = function (obj, strict) {
        var h = OBJECT_HASH_MAP.get(obj);

        if (h === undefined) {
            // create object-literals hash based on their visible properties in non-strict mode
            if (strict !== true && isObjectLiteral(obj)) {
                h = OBJECT_HASH_SEED;

                // early seed prevents mutually recursive structures to stack overflow
                OBJECT_HASH_MAP.set(obj, 0);

                // only object literals fall into following code, no need to check for hasOwnProperty
                var prop;
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
    };
}
else {
    compute31BitObjecHash = function (obj, strict) {
        var h = 0;
        var extensible = Object.isExtensible && Object.isExtensible(obj);

        // only override 'hash' method when object is extensible (not sealed or frozen)
        if (extensible) {
            // create object-literals hash based on their visible properties
            obj[hashSymbol] = function () {
                return h;
            };
        }

        // create object-literals hash based on their visible properties in non-strict mode
        if (strict !== true && isObjectLiteral(obj)) {
            h = OBJECT_HASH_SEED;

            // only object literals fall into following code, no need to check for hasOwnProperty
            var prop;
            for (prop in obj) {
                if (prop === hashSymbol) {
                    continue;
                }

                h = combineHash(h, compute31BitStringHash(prop) + hash(obj[prop]));
            }
        }
        else {
            // return constant hash codes for non-extensible class instances
            h = extensible ? OBJECT_HASH_INDEX++ >> 32 : OBJECT_HASH_SEED;
        }

        return h;
    };
}

export {compute31BitObjecHash as default};

