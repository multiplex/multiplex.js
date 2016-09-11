export default function binarySearch(array, index, length, value, compare) {
    var lo = index,
        hi = index + length - 1,
        order = 0,
        i = 0;

    while (lo <= hi) {
        i = lo + ((hi - lo) >> 1);
        order = compare(array[i], value);

        if (order === 0) {
            return i;
        }
        else if (order < 0) {
            lo = i + 1;
        }
        else {
            hi = i - 1;
        }
    }

    return ~lo;
}
