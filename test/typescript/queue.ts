module MxTests {

    function CreateQueue(): Queue<number> {
        return new Queue(mx.range(1, 5));
    }


    QUnit.module("Queue");


    QUnit.test("constructor", function (assert) {

        assert.ok(new Queue<number>().count() === 0, "initialize an empty Queue!");
        assert.ok(CreateQueue().count() === 5, "initialize a Queue using specified collection!");
    });


    QUnit.test("clear", function (assert) {

        var _queue = CreateQueue();

        _queue.clear();
        assert.ok(_queue.count() === 0, "clears a Queue!");
    });


    QUnit.test("contains", function (assert) {

        var _queue = CreateQueue();

        assert.ok(_queue.contains(1) === true, "queue containing an item!");
        assert.ok(_queue.contains(10) === false, "queue does not contain an item!");
    });


    QUnit.test("copyTo", function (assert) {

        var _queue = CreateQueue(),
            _arr = new Array(_queue.count());

        _queue.copyTo(_arr, 0);
        assert.deepEqual(_arr, [1, 2, 3, 4, 5], "queue copy to an array!");
        assert.throws(() => _queue.copyTo([], 0), "throws an error when the number of elements is greater than the number of elements that the destination array can contain!");
    });


    QUnit.test("dequeue", function (assert) {

        var _queue = CreateQueue();

        assert.ok(_queue.dequeue() === 1, "queue dequeue an item!");

        _queue.clear();
        assert.throws(() => _queue.dequeue(), "throws an error dequeue from empty queue!");
    });


    QUnit.test("enqueue", function (assert) {

        var _queue = CreateQueue();

        _queue.enqueue(6);
        assert.ok(_queue.count() === 6 && _queue.peek() === 1, "queue dequeue an item!");
    });


    QUnit.test("peek", function (assert) {

        var _queue = CreateQueue();

        assert.ok(_queue.peek() === 1, "queue peek an item!");

        _queue.clear();
        assert.throws(() => _queue.peek(), "throws an error peek from empty queue!");
    });


    QUnit.test("toArray", function (assert) {

        var _queue = CreateQueue();

        assert.deepEqual(_queue.toArray(), [1, 2, 3, 4, 5], "queue to array!");
    });


    QUnit.test("queue enumerable", function (assert) {

        var _queue = CreateQueue();

        assert.deepEqual(_queue.select(t => t * 2).where(t => t > 5).toArray(), [6, 8, 10], "select-where-toArray over a queue!");
    });
}