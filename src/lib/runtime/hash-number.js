var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

export default function compute31BitNumberHash(val) {
    var _hash = 0;

    // integer number
    if (val <= MAX_SAFE_INTEGER && val >= MIN_SAFE_INTEGER && val % 1 === 0) {
        return val >> 32;
    }

    // non-integer numbers
    switch (val) {
        case POSITIVE_INFINITY: _hash = 0x7F800000; break;
        case NEGATIVE_INFINITY: _hash = 0xFF800000; break;
        default:

            if (val <= -0.0) {
                _hash = 0x80000000;
                val = -val;
            }

            var _exponent = Math.floor(Math.log(val) / Math.log(2)),
                _significand = ((val / Math.pow(2, _exponent)) * 0x00800000) | 0;

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
