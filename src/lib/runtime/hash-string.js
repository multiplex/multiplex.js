export default function compute31BitStringHash(obj) {
    var _hash = 0X7FFF,         // string hash seed
        _len = obj.length,
        _i = 0;

    for (; _i < _len;) {
        _hash = ((((_hash << 5) - _hash) | 0) + obj.charCodeAt(_i++)) | 0;
    }

    return _hash & 0X7FFFFFFF;
}
