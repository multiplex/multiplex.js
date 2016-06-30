/**
* Searches a range of elements in a sorted Array for an element using the specified comparer function and returns the zero-based index of the element.
* @param {Array} array The sorted array to find value.
* @param {Number} index The zero-based starting index of the range to search.
* @param {Number} length The length of the range to search.
* @param {Object} value The value to locate.
* @param {Function} comparer The Comparer function to use when comparing elements.
* @returns {Number}
*/
export default function binarySearch(array, index, length, value, comparer) {
    let _lo = index,
        _hi = index + length - 1,
        _order = 0,
        _i = 0;

    while (_lo <= _hi) {
        _i = _lo + ((_hi - _lo) >> 1);
        _order = comparer(array[_i], value);

        if (_order === 0) {
            return _i;
        }
        else if (_order < 0) {
            _lo = _i + 1;
        }
        else {
            _hi = _i - 1;
        }
    }

    return ~_lo;
}
