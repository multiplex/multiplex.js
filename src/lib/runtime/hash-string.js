const __stringHashSeed = Math.floor(Math.random() * 0X7FFF) + 0X7FFF;

export default function compute31BitStringHash(obj) {
    let _hash = __stringHashSeed,
        _len = obj.length,
        _i = 0;

    for (; _i < _len; _i++) {
        _hash = ((((_hash << 5) - _hash) | 0) + obj.charCodeAt(_i)) | 0;
    }

    return _hash & 0X7FFFFFFF;
}
