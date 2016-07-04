const POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

export default function compute31BitNumberHash(obj) {
    let _hash = 0;

    // integer number
    if (obj < MAX_SAFE_INTEGER && obj > MIN_SAFE_INTEGER && obj % 1 === 0) {
        return obj >> 32;
    }

    // non-integer numbers
    switch (obj) {
        case POSITIVE_INFINITY: _hash = 0x7F800000; break;
        case NEGATIVE_INFINITY: _hash = 0xFF800000; break;
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

    return _hash >> 32;
}
