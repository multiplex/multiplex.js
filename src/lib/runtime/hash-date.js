export default function compute31BitDateHash(obj) {
    let _time = obj.getTime();
    return _time ^ (_time >> 5);
}
