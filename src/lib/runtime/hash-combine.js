export default function combineHash(h1, h2) {
    return ((h1 << 7) | (h1 >> 25)) ^ h2;
}
