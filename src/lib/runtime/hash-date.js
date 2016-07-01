export default function compute31BitDateHash(obj) {
    var _time = obj.getTime();
    return _time ^ (_time >> 5);
}
