export default function compute31BitStringHash(val) {
    var h = 0X7FFF,         // string hash seed
        len = val.length,
        i = 0;

    for (; i < len;) {
        h = ((((h << 5) - h) | 0) + val.charCodeAt(i++)) | 0;
    }

    return h >> 32;
}
