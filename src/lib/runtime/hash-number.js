var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

export default function compute31BitNumberHash(val) {
    var h = 0;

    // integer number
    if (val <= MAX_SAFE_INTEGER && val >= MIN_SAFE_INTEGER && val % 1 === 0) {
        return val >> 32;
    }

    // non-integer numbers
    switch (val) {
        case POSITIVE_INFINITY: h = 0x7F800000; break;
        case NEGATIVE_INFINITY: h = 0xFF800000; break;
        default:
            // NaN
            if (isNaN(val)) {
                h = 0;
                break;
            }

            if (val <= -0.0) {
                h = 0x80000000;
                val = -val;
            }

            var exponent = Math.floor(Math.log(val) / Math.log(2)),
                significand = ((val / Math.pow(2, exponent)) * 0x00800000) | 0;

            exponent += 127;

            if (exponent >= 0xFF) {
                exponent = 0xFF;
                significand = 0;
            }
            else if (exponent < 0) {
                exponent = 0;
            }

            h = h | (exponent << 23);
            h = h | (significand & ~(-1 << 23));
            break;
    }

    return h >> 32;
}
