import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('queue');

var Queue = mx.Queue;


function createQueue() {
    return new Queue(mx.range(1, 5));
}


qtest('create queue', function (assert) {
    assert.ok(new Queue() !== null, 'empty queue');
    assert.ok(new Queue([1, 2, 3]) !== null, 'simple numeric queue');
});


qtest('queue toString', function (assert) {
    assert.equal(new Queue().toString(), '[Queue]', 'Queue toString');
});


qtest('queue "clear" tests', function (assert) {
    var _queue = createQueue();

    _queue.clear();
    assert.ok(_queue.count() === 0, 'clears a Queue!');
});


qtest('queue "contains" tests', function (assert) {
    var _queue = createQueue();

    assert.ok(_queue.contains(1) === true, 'queue containing an item!');
    assert.ok(_queue.contains(10) === false, 'queue does not contain an item!');
});


qtest('queue "copyTo" tests', function (assert) {
    var _queue = createQueue(),
        _arr = new Array(_queue.count());

    _queue.copyTo(_arr, 0);

    assert.deepEqual(_arr, [1, 2, 3, 4, 5], 'queue copy to an array!');
    assert.throws(function () {
        _queue.copyTo([], 0);
    }, 'throws an error when the number of elements is greater than the number of elements that the destination array can contain!');
});


qtest('queue "dequeue" tests', function (assert) {
    var _queue = createQueue();

    assert.ok(_queue.dequeue() === 1, 'queue dequeue an item!');

    _queue.clear();
    assert.throws(function () {
        _queue.dequeue();
    }, 'throws an error dequeue from empty queue!');
});


qtest('queue "enqueue" tests', function (assert) {
    var _queue = createQueue();

    _queue.enqueue(6);

    assert.ok(_queue.count() === 6 && _queue.peek() === 1, 'queue dequeue an item!');
});


qtest('queue "peek" tests', function (assert) {
    var _queue = createQueue();

    assert.equal(_queue.peek(), 1, 'queue peek an item!');

    _queue.clear();
    assert.throws(function () {
        _queue.peek();
    }, 'throws an error peek from empty queue!');
});


qtest('queue "toArray" tests', function (assert) {
    var _queue = createQueue();

    assert.deepEqual(_queue.toArray(), [1, 2, 3, 4, 5], 'queue to array!');
});