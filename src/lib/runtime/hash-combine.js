export default function combineHash(h1, h2) {
    return ((h1 << 7) | (h1 >> 25)) ^ h2;
    //return ((17 * 31 + h1) * 31 + h2) >> 32;
}
