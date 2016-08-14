import valueOf from '../utils/value-of';

export default function compute31BitDateHash(date) {
    var time = valueOf(date);
    return time ^ (time >> 5);
}
