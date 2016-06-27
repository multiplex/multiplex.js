import isObjectLiteral from '../utils/is-object-literal';
export const hashSymbol = '__hash__';

const _lower31BitMask = 0X7FFFFFFF;
const _hashSeed = Math.floor(Math.random() * 0X7FFF) + 0X7FFF;
const _hashMap = new WeakMap();
let _hashIndex = _hashSeed;


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @param {...Objects} rest Optional number of objects to combine their hash codes.
* @returns {Number}
*/
export default function hash(obj, ...rest) {
    let _hash;

    // null/undefined hash is 0
    if (obj == null) {
        _hash = 0;
    }


    // use 'instanceof' and 'typeof' operators to maximize performance

    // Compute 'Number' primitive type hash (does not incluede 'new Number(value)')
    if (typeof obj === 'number') {
        // integer number
        if (obj % 1 === 0) {
            _hash = obj >> 32;
        }

        // floating numbers
        else {
            _hash = compute31BitFloatNumberHash(obj);
        }
    }


    // Compute 'String' primitive type hash (does not incluede 'new String(value)')
    else if (typeof obj === 'string') {
        _hash = compute31BitStringHash(obj);
    }


    // Compute 'Boolean' primitive type hash (does not incluede 'new Boolean(value)')
    else if (typeof obj === 'boolean') {
        _hash = obj ? 1 : 0;
    }


    // Compute 'Objects' hash
    else {
        // Compute 'Date' object type hash
        if (obj instanceof Date) {
            _hash = compute31BitDateHash(obj);
        }

        // Compute overriden '__hash__' method
        else if (typeof obj.__hash__ === 'function') {
            _hash = obj.__hash__();
        }

        // Compute 'Object' type hash for all other types
        else {
            _hash = compute31BitObjecHash(obj);
        }
    }


    // Combine hash codes for given inputs
    if (rest.length) {
        let _len = rest.length,
            _i = 0;

        while (++_i < _len) {
            // Josh Bloch hash method to combine 2 hash
            _hash = (17 * 31 + _hash) * 31 + hash(rest[_i]);
        }
    }

    return _hash;
}


/// Creates a HashCode for a String object.
function compute31BitStringHash(obj) {
    let _hash = _hashSeed,
        _len = obj.length;

    for (let i = 0; i < _len; i++) {
        _hash = ((((_hash << 5) - _hash) | 0) + obj.charCodeAt(i)) | 0;
    }

    return _hash & _lower31BitMask;
}


/// Creates a HashCode for a Number.
function compute31BitFloatNumberHash(obj) {
    let _hash = 0;
    switch (obj) {
        case Number.POSITIVE_INFINITY: _hash = 0x7F800000; break;
        case Number.NEGATIVE_INFINITY: _hash = 0xFF800000; break;
        case +0.0: _hash = 0x40000000; break;
        case -0.0: _hash = 0xC0000000; break;
        default:

            if (obj <= -0.0) {
                _hash = 0x80000000;
                obj = -obj;
            }

            let _exponent = Math.floor(Math.log(obj) / Math.log(2)),
                _significand = ((obj / Math.pow(2, _exponent)) * 0x00800000) | 0;

            _exponent += 127;

            if (_exponent >= 0xFF) {
                _exponent = 0xFF;
                _significand = 0;
            }
            else if (_exponent < 0) {
                _exponent = 0;
            }

            _hash = _hash | (_exponent << 23);
            _hash = _hash | (_significand & ~(-1 << 23));
            break;
    }

    return _hash & _lower31BitMask;
}


/// Creates a HashCode for a Date object.
function compute31BitDateHash(obj) {
    let _time = obj.getTime();
    return _time ^ (_time >> 5);
}


/// Creates and stores a HashCode for an object.
function compute31BitObjecHash(obj) {
    let _hash = _hashMap.get(obj);

    if (_hash == null) {
        if (isObjectLiteral(obj)) {
            _hash = _hashSeed;
            _hashMap.set(obj, 0);           // prevents recursion

            // only object literals fall into following code, no need to check for hasOwnProperty

            for (let _p in obj) {
                // Josh Bloch hash method
                _hash = (17 * 31 + _hash) * 31 + compute31BitStringHash(_p) + hash(obj[_p]);
            }

            _hash = _hash & _lower31BitMask;
        }
        else {
            _hash = _hashIndex++ >> 32;
        }

        _hashMap.set(obj, _hash);
    }

    return _hash;
}
