export default function combineHash(h1, h2) {
    return (((h1 << 5) | (h1 >> 27)) + h1) ^ h2;
}
