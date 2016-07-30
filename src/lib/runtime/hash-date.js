import valueOf from '../utils/value-of';

export default function compute31BitDateHash(date) {
    var _time = valueOf(date);
    return _time ^ (_time >> 5);
}
