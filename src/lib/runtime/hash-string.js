export default function compute31BitStringHash(val) {
    var _hash = 0X7FFF,         // string hash seed
        _len = val.length,
        _i = 0;

    for (; _i < _len;) {
        _hash = ((((_hash << 5) - _hash) | 0) + val.charCodeAt(_i++)) | 0;
    }

    return _hash >> 32;
}
