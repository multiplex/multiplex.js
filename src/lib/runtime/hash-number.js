export default function compute31BitNumberHash(obj) {
    var _hash = 0;

    // integer number
    if (obj % 1 === 0) {
        return obj >> 32;
    }

    // floating numbers
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

            var _exponent = Math.floor(Math.log(obj) / Math.log(2)),
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

    return _hash & 0X7FFFFFFF;
}
