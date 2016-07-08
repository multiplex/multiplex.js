import valueOf from '../utils/value-of';

export default function compute31BitDateHash(val) {
    let _time = valueOf(val);
    return _time ^ (_time >> 5);
}
