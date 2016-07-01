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
