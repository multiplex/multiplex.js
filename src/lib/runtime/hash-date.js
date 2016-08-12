import valueOf from '../utils/value-of';

export default function compute31BitDateHash(val) {
    let time = valueOf(val);
    return time ^ (time >> 5);
}
