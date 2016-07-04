export default function compute31BitDateHash(val) {
    var _time = val.getTime();
    return _time ^ (_time >> 5);
}
