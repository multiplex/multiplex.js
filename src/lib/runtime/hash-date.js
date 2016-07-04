export default function compute31BitDateHash(val) {
    let _time = val.getTime();
    return _time ^ (_time >> 5);
}
